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

  function renderGeneration(list) {
    const root = document.getElementById("generation-list");
    if (!root) return;

    (list || []).forEach((item) => {
      root.appendChild(
        el("article", { className: "demo-card" }, [
          el("div", { className: "demo-card-header" }, [
            el("p", {
              className: "demo-title",
              text: item.prompt || "Prompt unavailable."
            })
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

  renderGeneration(data.generation);
  wireCopyButton();
})();
