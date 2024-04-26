import { __baseUrl } from "./_restApi";


export const imageSource = (image) => `${__baseUrl}/data/image/${image?.id}/download`
