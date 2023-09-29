// This feature depends on Swiper.js and the public API call that currently happens in the NavCustom
async function fetchData(url) {
  try {
    let response = await fetch(url, {
      cache: "no-store",
    });

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    return await response.json();
  } catch (error) {
    console.error("Fetch error: " + error.message);
  }
}

function injectLoadingHTML() {
  const loadingHtml = `
      <div class="ers-related-items-feature">
          <div class="container">
              <div class="store-iterator">
                  <div class="store-loader">
                      
                  </div>
              </div>
          </div>
      </div>
      `;

  const storeSection = document.querySelector("section.store");
  injectCSS();
  console.log("CSS injected");
  storeSection.insertAdjacentHTML("afterend", loadingHtml);
  console.log("HTML injected");
}

function removeFeatureHTML() {
  document.querySelector(".ers-related-items-feature").remove();
}

function replaceLoader() {
  document.querySelector(".ers-related-items-feature").classList.add("visible");

  setTimeout(animateCards, 300);
}

function animateCards() {
  let cards = document.querySelectorAll(".swiper-slide");

  // Iterate over each card and assign a transition delay based on the index.
  cards.forEach((card, index) => {
    let delay = index * 150;
    card.style.transitionDelay = `${delay}ms`;

    // Trigger the animation
    requestAnimationFrame(() => {
      card.classList.add("animate");
    });
  });
}

function injectCSS() {
  const cssString = `
      .ers-related-items-feature {
          overflow: hidden;
          opacity: 0;
          max-height: 0;
          transition: max-height 0.2s ease-in-out, opacity 0.2s ease-in-out;
      }
      .ers-related-items-feature.visible {
          opacity: 1;
          max-height: 500px;
      }
      .ers-related-items-feature .swiper-slide {
          opacity: 0;
          transform: translateY(-20px);
          transition: transform 0.3s ease-out, opacity 0.3s ease-out;
      }
      .ers-related-items-feature .swiper-slide.animate {
          transform: translateY(0);
          opacity: 1;
      }
      .ers-related-items-feature .container {
          background: #FAF9F6;
          border-radius: 10px;
      }
      .ers-related-items-feature .store-iterator {
          padding: 20px 0;
      }
      .ers-related-items-feature .related-items-header {
          font-family: 'Lato', sans-serif;
      }
      .ers-related-items-feature .related-item-cards {
          position: relative;
      }
      .ers-related-items-feature .swiper-container {
          width: 100%;
          max-width: 100%;
          max-height: 100vh;
          min-height: 0;
          min-width: 0;
          padding: 0 30px;
      }
      .swiper-button-prev {
        left: 0px;
      }
      .swiper-button-next {
        right: 0px;
      }
      .ers-related-items-feature .related-item-name {
          color: #222;
          font-size: 18px;
          font-family: 'Lato', sans-serif;
      }
      .ers-related-items-feature .related-item-button {
          padding: 10px;
          color: #fff;
          background-color: var(--color-theme-6);
          border-radius: 5px;
          transition: all 0.2s ease-out;
          font-weight: 400;
      }
      .ers-related-items-feature .card:hover .related-item-button {
          filter: drop-shadow(0px 0px 3px #222);
      }
      .ers-related-items-feature .related-item-button > i {
          margin: 0px 10px;
          transform: translateX(0);
          transition: transform 0.3s;
      }
      .card:hover .related-item-button > i {
        animation: bounceRight .5s ease-in-out;
      }
      .ers-related-items-feature .related-item-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
      }
      .ers-related-items-feature .related-item-content {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
      }
      .ers-related-items-feature .related-item-wrapper > .related-item-image {
          display: flex;
          align-items: flex-end;
          justify-content: center;
      }
      .ers-related-items-feature .related-item-image > img {
          max-width: 100%;
          height: 150px;
          border-radius: 10px;
      }
      .ers-related-items-feature .related-items-swiper {
          padding: 10px;
      }
      .ers-related-items-feature .swiper-wrapper {
          align-items: end;
      }
      .ers-related-items-feature .related-items-swiper-next,
      .ers-related-items-feature .related-items-swiper-prev {
          font-weight: 900;
          margin-top: 0;
      }
      .ers-related-items-feature .related-items-swiper-next,
      .ers-related-items-feature .related-items-swiper-prev {
          color: var(--color-theme-1);
      }
      .ers-related-items-feature .related-items-swiper .swiper-wrapper {
          align-items: stretch;
      }
      .ers-related-items-feature .related-items-swiper .swiper-slide {
          height: auto;
          padding: 10px;
          background: white;
          border-radius: 10px;
          filter: drop-shadow(0px 0px 3px #888);
      }
      .ers-related-items-feature .related-item-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 100%;
          justify-content: space-around;
          row-gap: 10px;
      }
      .ers-related-items-feature .related-see-all {
          background-color: var(--color-theme-5);
          display: inline-block;
          margin-top: 20px;
      }
      @media (min-width: 992px) {
          .ers-related-items-feature .related-items-flex {
              column-gap: 20px;
          }
      }
      @keyframes bounceRight {
        0%, 100% {
          transform: translateX(0); /* start and end at initial position */
        }
        50% {
          transform: translateX(10px); /* At the middle of the animation translate to the right */
        }
      }
      `;

  const styleElement = document.createElement("style");
  styleElement.setAttribute("type", "text/css");

  styleElement.appendChild(document.createTextNode(cssString));

  document.head.appendChild(styleElement);
}

async function populateRelatedItems(event, relatedItems) {
  const products = window.products || event?.detail?.products;

  let thisItem = window.itemId;
  console.log(relatedItems[thisItem]);
  if (!relatedItems[thisItem].length) {
    removeFeatureHTML();
  } else {
    injectCSS();
  }

  const relatedProductObjects = [];
  const relatedItemsSet = new Set(relatedItems[thisItem]);

  products.forEach((product) => {
    if (relatedItemsSet.has(product.id)) {
      relatedProductObjects.push(product);
    }
  });

  const storeLoader = document.querySelector(
    ".ers-related-items-feature .store-loader"
  );
  const storeIterator = document.querySelector(
    ".ers-related-items-feature .store-iterator"
  );

  const itemCardHTML = relatedProductObjects
    .map(
      (product) => `
          <div class="swiper-slide card">
              <a class="related-item-wrapper" href="${product.url}" >
                  <div class="related-item-image">
                      <img src="${product.picture}" alt="${product.alt}" />
                  </div>
                  <div class="related-item-content">
                      <span class="related-item-name">${product.name} $${product.baseCost}</span>
                  </div>
                  <div class="related-item-content">
                      <div class="related-item-button">
                        More Info <i class="fa fa-arrow-right" aria-hidden="true"></i>
                      </div>
                  </div>
              </a>
          </div>
      `
    )
    .join("");

  const htmlString = `
      <h3 class="related-items-header">Products related to this item</h3>
      <div class="swiper-container">
          <div class="swiper related-items-swiper">
              <div class="swiper-wrapper">
                  ${itemCardHTML}
              </div>
          </div>
      </div>
      <div class="swiper-button-prev related-items-swiper-prev"></div>
      <div class="swiper-button-next related-items-swiper-next"></div>
      `;

  const newElement = document.createElement("div");
  newElement.setAttribute("class", "related-item-cards");
  newElement.innerHTML = htmlString;

  if (storeIterator && storeLoader) {
    storeIterator.replaceChild(newElement, storeLoader);
    replaceLoader();
  } else {
    console.error('Section with class "store" not found!');
  }

  initSwiper();
  console.log(relatedProductObjects);
}

function initSwiper() {
  const swiper = new Swiper(".related-items-swiper", {
    slidesPerView: "auto",
    spaceBetween: 15,
    navigation: {
      nextEl: ".related-items-swiper-next",
      prevEl: ".related-items-swiper-prev",
    },
    breakpoints: {
      450: {
        slidesPerView: 2,
        spaceBetween: 20,
      },

      768: {
        slidesPerView: 3,
        spaceBetween: 30,
      },

      992: {
        slidesPerView: 4,
        spaceBetween: 40,
      },
    },
  });
}

(async () => {
  injectLoadingHTML();
  try {
    const url = `https://related-items.sfo3.digitaloceanspaces.com/${window.foldername}/items/relatedItems.json`;
    let relatedItems = await fetchData(url);
    if (relatedItems) {
      if (window.productsLoadedState) {
        populateRelatedItems(null, relatedItems);
      } else {
        document.addEventListener("productsLoaded", (event) => {
          populateRelatedItems(event, relatedItems);
        });
      }
    } else {
      console.error("No related items found for this item");
    }
  } catch (err) {
    console.error(err);
  }
})();
