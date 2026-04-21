import {
  NOT_FOUND,
  NOT_FOUND as NOT_FOUND_MESSAGE
} from '@lib/httpStatusCodes';

function notFound(context: any) {
  return context.json(
    {
      message: `${NOT_FOUND_MESSAGE} - ${context.req.path}`
    },
    NOT_FOUND
  );
}

export default notFound;
