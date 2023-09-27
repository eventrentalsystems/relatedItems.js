  let searchEndpoint = 'https://api.partyrental.marketing/v1/installs/[setting:folder]/products';
  let products = [];
  let categories = [];
  window.products = [];
  let query = '';

    fetch(searchEndpoint)
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(`${response.status} Error: ${err.message}`);
                });
            }
            return response.json();
        })
        .then(response => {
            products = response.data.products;
            categories = response.data.categories;
            window.products = response.data.products;
            window.productsLoadedState = true;
            
            // Dispatch a Custom Event when products are populated.
            document.dispatchEvent(new CustomEvent('productsLoaded', { detail: { products, categories } }));
        })
        .catch(error => console.error('Error Fetching Data:', error));

