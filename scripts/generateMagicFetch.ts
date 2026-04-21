import prettier from 'prettier';
import env from '@config/env';
import { join } from 'path';
import print from '@util/print';

/**
 * Genera la llave de una ruta para un mapa
 */
function generateKey(path: string): string {
  const parts = path.split('/')[1]?.split('-');
  if (!parts) return '';

  return parts
    .map((part, index) => {
      if (index === 0) return part.toLowerCase();
      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    })
    .join('');
}

/**
 * Obtener cuerpo del query y sus tipos
 */
function parseRequestQuery(parameters: any): string[] {
  if (!parameters) return [];

  let params = [];
  let types = [];

  parameters.forEach((value) => {
    const { in: inParameter, schema, name, required } = value;
    const type = schema.type;

    if (inParameter == 'query') {
      params.push(name);
      types.push(`${name}${required ? '' : '?'}: ${type}`);
    }
  });

  return [params.join(', '), types.join(', ')];
}

function parseRequestBody(requestBody: any): string[] {
  if (!requestBody) return [];

  const properties =
    requestBody.content['application/json']?.schema?.properties;

  if (!properties) return [];

  const required = requestBody.content['application/json']?.schema?.required;

  // if (!required.includes(key)) {

  // }

  const params = Object.keys(properties)
    .map((key) => key)
    .join(', ');

  const paramsType = Object.entries(properties)
    .map(([key, value]: [string, any]) => {
      let type = value.type;
      if (type == 'integer') type = 'number';
      if (type === 'array') type = `${value.items.type}[]`;
      const optional = required.includes(key) ? '' : '?';
      return `${key}${optional}: ${type}`;
    })
    .join(', ');

  return [params, paramsType];
}

function parseRequestParam(endpoint: any): any[] {
  const { parameters, path } = endpoint;

  let params = '';
  let paramsType = '';
  let optionalParam = false;

  // asegurarse que parameters exista
  if (hasRouteParam(path)) {
    params = 'param';

    if (parameters) {
      let type = parameters[0].schema.type;

      paramsType = type;
      // let required = parameters[0].required;
      let optional = path.includes('?');
      if (optional) {
        optionalParam = true;
      }
    } else {
      // agregar un tipo por defecto si no se especifica que tipo de parametro tiene
      paramsType = 'string | number';
    }
  }

  return [params, paramsType, optionalParam];
}

function parseResponse(response: any): {
  responseType: string;
  isArray: boolean;
} {
  const schema = response?.[200]?.content?.['application/json']?.schema;
  if (!schema) return { responseType: '', isArray: false };

  const properties = schema.properties || schema.items?.properties;
  const isArray = !!schema.items;
  if (!properties) return { responseType: '', isArray };

  const responseType = Object.entries(properties)
    .map(([key, value]: [string, any]) => {
      let type = value.type;
      // const type = value.type === 'integer' ? 'number' : value.type;
      if (type == 'integer') type = 'number';
      if (type == 'array') type = 'any[]';
      return `${key}: ${type}`;
    })
    .join(', ');

  return { responseType: `{ ${responseType} }`, isArray };
}

function hasRouteParam(url: string): boolean {
  const paramRegex = /:\w+/;
  return paramRegex.test(url);
}

function replaceRouteParam(url: string, value: string): string {
  const paramRegex = /:\w+\??/g;
  return url.replace(paramRegex, value);
}

/**
 * Generar nombre de la función
 */
function urlToFunctionName(method: string, url: string): string {
  const segments = url
    .split('/')
    .filter((s) => s && !s.startsWith(':'))
    .slice(1); // saltarse el primer segmento

  const name = segments
    .flatMap((segment) =>
      segment
        .split('-') // separar palabras con -
        .map((sub) =>
          sub
            .replace(/[^a-zA-Z0-9]/g, '')
            .replace(/^[a-z]/, (c) => c.toUpperCase())
        )
    )
    .join('');

  return method.toLowerCase() + name;
}

const functionNames = new Map<string, any>();

function generateEndpointFunctions(endpoints: any[], area: string): string {
  return endpoints
    .map((endpoint) => {
      const { path, method, requestBody, responses, parameters } = endpoint;

      const [queryValues, queryTypes] = parseRequestQuery(parameters) || [
        '',
        ''
      ];

      const [bodyValues, bodyTypes] = parseRequestBody(requestBody) || ['', ''];

      const [paramValues, paramTypes, paramOptional] = parseRequestParam(
        endpoint
      ) || ['', ''];

      const { responseType, isArray } = parseResponse(responses);

      let functionName = urlToFunctionName(method, path);

      // si ya existe ese nombre de función, añadirle un string
      if (functionNames.has(`${area}-${functionName}`)) {
        functionName += 'Extra';
      } else {
        functionNames.set(`${area}-${functionName}`, functionName);
      }

      // contruir parametros y sus tipos
      const params = [];
      const types = [];

      if (paramValues) {
        params.push(`param: ${paramValues}`);
        types.push(`param${paramOptional ? '?' : ''}: ${paramTypes}`);
      }

      if (queryValues) {
        params.push(`query: { ${queryValues} }`);
        types.push(`query: { ${queryTypes} }`);
      }

      if (bodyValues) {
        params.push(`body: { ${bodyValues} }`);
        types.push(`body: { ${bodyTypes} }`);
      }

      const finalParams = params.join(', ');
      const finalTypes = types.join(', ');

      const responseTypeString = responseType
        ? `: Promise<AxiosResponse<${responseType}${isArray ? '[]' : ''}>>`
        : '';

      // Handle path replacements for route parameters
      const finalPath = paramValues
        ? replaceRouteParam(path, '${param}')
        : path;

      // generar la funcion
      return `
        ${functionName}: async (${finalParams ? `{ ${finalParams} }` : ''}${
          finalTypes ? `: { ${finalTypes} }` : ''
        })${responseTypeString} => {
          const response = await _.${method}(\`${finalPath}\`, 
          { ${bodyValues ? bodyValues : ''} ${queryValues ? `params: {${queryValues}}` : ''} }
            );
          return response;
        },
      `;
    })
    .join('\n');
}

export async function generateMagicFetch(app) {
  if (env.MODE != 'development' || !env.MAGICFETCH_GENERATE) return;

  print('Generando magic fetch...');

  const doc = app.getOpenAPIDocument();

  if (!doc) return;

  const paths = doc.paths;

  const map = new Map<string, any[]>();

  for (const path in paths) {
    const methods = paths[path];

    for (const method in methods) {
      const endpoint = {
        path,
        method,
        ...methods[method]
      };
      const key = generateKey(path);

      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)!.push(endpoint);
    }
  }

  let fileContent = `
    import { AxiosResponse } from 'axios';
    import _ from '@services/axios';
    const api = {
  `;

  // crear esquemas
  for (const [area, endpoints] of map.entries()) {
    try {
      fileContent += `
      ${area}: {
        ${generateEndpointFunctions(endpoints, area)}
      },
    `;
    } catch (error) {
      print('MagicFetch error en:', area);
      console.log(error);
      return;
    }
  }

  fileContent += `
    };
    export default api;
  `;

  const formatted = await prettier.format(fileContent, {
    parser: 'typescript'
  });

  const generatePaths = env.MAGICFETCH_OUTPUT_FILES;

  for (const generatePath of generatePaths) {
    const filePath = join(import.meta.dir, `../${generatePath}/magicFetch.ts`);

    await Bun.write(filePath, formatted);
  }

  print('MagicFetch generado con éxito');
}
