export const reactWrapper = (
  data: any,
  name: string,
  template: string,
  hydrate: boolean
): string => {
  return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>React Page Usings Plugin</title>
        <script>window.__INITIAL__DATA__ = ${JSON.stringify(data)}</script>
    </head>
    <body>
        <div id="reactele">${template}</div>${
    hydrate ? `<script src="/hydrate/${name}" defer></script>` : ""
  }
    </body>
    </html>`;
};
