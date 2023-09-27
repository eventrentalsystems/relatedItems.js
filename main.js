// This feature depends on Swiper.js and the public API call that currently happens in the NavCustom
// It uses a Custom Event to listen for 'products' to be populated by the API call
async function fetchData(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    return await response.json();
  } catch (error) {
    console.error("Fetch error: " + error.message);
  }
}

// Initialize the function by injecting the loading symbol to the DOM
const loadingHtml = `
  <div class="ers-related-items-feature">
      <div class="container">
          <div class="store-iterator">
              <div class="store-loader">
                  <img style="height:100px;" src="https://c.tenor.com/5o2p0tH5LFQAAAAj/hug.gif"/>
              </div>
          </div>
      </div>
  </div>
  `;

const storeSection = document.querySelector("section.store");
storeSection.insertAdjacentHTML("afterend", loadingHtml);

// Fetch the Digital Ocean space data to get the relatedItems object, then render the data in a swiper
async function populateRelatedItems(event) {
  const products = window.products || event?.detail?.products;

  const folderName = window.location.hostname.split(".")[0];
  const url = `https://related-items.sfo3.digitaloceanspaces.com/${folderName}/items/relatedItems.json`;

  const itemURL = window.location.pathname.match(/\/items\/[^\/]+\/?/)?.[0];
  if (!itemURL) {
    console.error("itemURL not found in the URL");
    return;
  }

  let thisItem;
  for (const productId in products) {
    if (products[productId].url === itemURL) {
      thisItem = products[productId].id;
      break;
    }
  }

  if (!thisItem) {
    console.error("No matching item found for the given itemURL");
    return;
  }

  // Call fetchData with the constructed URL and utilize the result
  const relatedItems = await fetchData(url);
  if (!relatedItems || !relatedItems[thisItem]) {
    console.error(
      "Unable to fetch related items or no related items found for this item"
    );
    return;
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
          <div class="swiper-slide">
              <a class="related-item-wrapper" href="${product.url}" >
                  <div class="related-item-image">
                      <img src="${product.picture}" alt="${product.alt}" />
                  </div>
                  <div class="related-item-content">
                      <span class="related-item-name">${product.name}</span>
                  </div>
              </a>
          </div>
      `
    )
    .join("");

  const htmlString = `
      <h3 class="related-items-header">Products related to this item</h3>
      <div class="related-items-flex">
          <div class="swiper-button-prev related-items-swiper-prev"></div>
          <div class="swiper related-items-swiper">
              <div class="swiper-wrapper">
                  ${itemCardHTML} <!-- Here we inject the item cards -->
              </div>
          </div>
          <div class="swiper-button-next related-items-swiper-next"></div>
      </div>
      `;

  const newElement = document.createElement("div");
  newElement.innerHTML = htmlString;

  if (storeIterator && storeLoader) {
    storeIterator.replaceChild(newElement, storeLoader);
  } else {
    console.error('Section with class "store" not found!');
  }

  const cssString = `
      body[class*=ers] .ers-related-items-feature .store-loader {
          display: none;
      }
      .ers-related-items-feature {
          margin: 2rem 0;
      }
      .ers-related-items-feature .related-items-header {
          font-family: 'Lato', sans-serif;
      }
      .ers-related-items-feature .related-items-flex {
          display: flex;
          flex-direction: row;
          align-items: center;
          column-gap: 10px;
      }
      .ers-related-items-feature .related-item-name {
          color: #222;
          font-size: 18px;
          font-family: 'Lato', sans-serif;
      }
      .ers-related-items-feature .related-item-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
      }
      .ers-related-items-feature .related-item-wrapper:hover {
          text-decoration: none;
      }
      .ers-related-items-feature .related-item-wrapper > .related-item-image {
          display: flex;
          align-items: flex-end;
          justify-content: center;
      }
      .ers-related-items-feature .related-item-image > img {
          max-width: 100%;
          transition: all 0.1s ease-in-out;
          height: 150px;
          width: 150px;
          object-fit: cover;
          border-radius: 10px;
      }
      .ers-related-items-feature .related-item-wrapper:hover img {
          transform: scale(.95);
      }
      .related-items-swiper .swiper-wrapper {
          align-items: end;
      }
      .ers-related-items-feature .related-items-swiper-next,
      .ers-related-items-feature .related-items-swiper-prev {
          position: static;
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
      `;

  const styleElement = document.createElement("style");
  styleElement.setAttribute("type", "text/css");

  styleElement.appendChild(document.createTextNode(cssString));

  document.head.appendChild(styleElement);

  const swiper = new Swiper(".related-items-swiper", {
    slidesPerView: 1,
    spaceBetween: 10,
    loop: true,
    navigation: {
      nextEl: ".related-items-swiper-next",
      prevEl: ".related-items-swiper-prev",
    },

    breakpoints: {
      // when window width is >= 576px

      400: {
        slidesPerView: 2,
        spaceBetween: 20,
      },

      // when window width is >= 768px

      768: {
        slidesPerView: 3,
        spaceBetween: 30,
      },

      // when window width is >= 992px

      992: {
        slidesPerView: 4,
        spaceBetween: 40,
      },
    },
  });
}

document.addEventListener("DOMContentLoaded", () => {
  if (window.productsLoadedState) {
    populateRelatedItems();
  } else {
    document.addEventListener("productsLoaded", populateRelatedItems);
  }
});
