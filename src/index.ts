const server = Bun.serve({
  port: 3000,
  fetch(request) {
    let params = new URL(request.url).searchParams;
    let project = params.get("project");
    let started = params.get("started");
    return new Response("Hello World!");
  },
});

console.log(`Listening on localhost: ${server.port}`);
