/*
  Pipeline: the site's signature interaction. Used on the Research page
  (research methodology) and the Journals page (publication status).
  Each stage is a button; clicking or arrow-keying between stages swaps a
  single detail panel rather than revealing/hiding many blocks at once,
  which keeps the interaction calm instead of turning into a slideshow.
*/

function initPipeline(pipeline) {
  const nodes = Array.from(pipeline.querySelectorAll("[data-pipeline-node]"));
  const detailTitle = pipeline.querySelector("[data-detail-title]");
  const detailBody = pipeline.querySelector("[data-detail-body]");
  if (!nodes.length || !detailTitle || !detailBody) return;

  function activate(node) {
    nodes.forEach((n) => n.setAttribute("aria-expanded", String(n === node)));
    detailTitle.textContent = node.dataset.title || "";
    detailBody.textContent = node.dataset.desc || "";
  }

  nodes.forEach((node, index) => {
    node.addEventListener("click", () => activate(node));

    node.addEventListener("keydown", (event) => {
      let target = null;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        target = nodes[index + 1] || nodes[0];
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        target = nodes[index - 1] || nodes[nodes.length - 1];
      }
      if (target) {
        event.preventDefault();
        target.focus();
        activate(target);
      }
    });
  });

  const defaultNode =
    pipeline.querySelector('[data-pipeline-node][data-default="true"]') ||
    nodes[0];
  activate(defaultNode);
}

export function initPipelines() {
  document.querySelectorAll("[data-pipeline]").forEach(initPipeline);
}
