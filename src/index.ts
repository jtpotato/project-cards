import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import template from "./template.txt";

function hashCode(str: string) {
  let hash = 0;
  for (let i = 0, len = str.length; i < len; i++) {
    let chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

dayjs.extend(relativeTime)

const handler = ({
  async fetch(request: Request) {
    let params = new URL(request.url).searchParams;
    let project = params.get("project");
    let started = params.get("started");
    let codename = params.get("codename");

    // hash the codename to get a colour
    let hash = hashCode(codename?.toLowerCase() ?? "");
    let leftCol = `hsl(${hash % 360}, 90%, 70%)`;
    let rightCol = `hsl(${(hash + 200) % 360}, 90%, 70%)`;

    // get age
    let age = dayjs(started).fromNow()

    let text = template;

    // templating
    let newSvg = text
      .replace("{{start_color}}", leftCol)
      .replace("{{stop_color}}", rightCol)
      .replace("{{codename}}", codename ?? "Unknown")
      .replace("{{project_name}}", project ?? "Unknown")
      .replace("{{start_date}}", started ?? "Unknown")
      .replace("{{age}}", age.toString() ?? "Unknown")

    return new Response(newSvg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "max-age=86400"
      },
    });
  },
});

export default handler;
