(function () {
  const data = window.BANDTOK_DEMO_DATA || {};

  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([key, value]) => {
      if (key === "className") {
        node.className = value;
      } else if (key === "text") {
        node.textContent = value;
      } else {
        node.setAttribute(key, value);
      }
    });
    (children || []).forEach((child) => node.appendChild(child));
    return node;
  }

  function renderTracks(tracks) {
    if (!tracks || tracks.length === 0) {
      return el("p", {
        className: "placeholder",
        text: "No complete matched audio files were available for this row."
      });
    }

    return el(
      "div",
      { className: "track-grid" },
      tracks.map((track) =>
        el("div", { className: "track" }, [
          el("span", { className: "track-label", text: track.label }),
          el("audio", { controls: "", preload: "none", src: track.src })
        ])
      )
    );
  }

  function renderReconstruction(list) {
    const root = document.getElementById("reconstruction-list");
    if (!root) return;

    (list || []).forEach((item, index) => {
      root.appendChild(
        el("article", { className: "demo-card" }, [
          el("div", { className: "demo-card-header" }, [
            el("p", {
              className: "demo-title",
              text: `${index + 1}. ${item.title || "Untitled example"}`
            }),
            el("p", {
              className: "demo-meta",
              text: item.sourceKey || item.excerpt || "Placeholder row"
            })
          ]),
          renderTracks(item.tracks)
        ])
      );
    });
  }

  function renderGeneration(list) {
    const root = document.getElementById("generation-list");
    if (!root) return;

    (list || []).forEach((item, index) => {
      const meta = item.captionId
        ? `caption_id ${item.captionId}${item.trackId ? ` · track_id ${item.trackId}` : ""}`
        : "Placeholder row";

      root.appendChild(
        el("article", { className: "demo-card" }, [
          el("div", { className: "demo-card-header" }, [
            el("p", {
              className: "demo-title",
              text: `${index + 1}. Prompt`
            }),
            el("p", { className: "prompt", text: item.prompt || "Prompt unavailable." }),
            el("p", { className: "demo-meta", text: meta })
          ]),
          renderTracks(item.tracks)
        ])
      );
    });
  }

  function wireCopyButton() {
    const button = document.getElementById("copy-bibtex");
    const bibtex = document.getElementById("bibtex");
    if (!button || !bibtex) return;

    button.addEventListener("click", async () => {
      const original = button.textContent;
      try {
        await navigator.clipboard.writeText(bibtex.textContent);
        button.textContent = "Copied";
      } catch (error) {
        button.textContent = "Copy failed";
      }
      window.setTimeout(() => {
        button.textContent = original;
      }, 1600);
    });
  }

  renderReconstruction(data.reconstruction);
  renderGeneration(data.generation);
  wireCopyButton();
})();
