var idbApp = (function () {
  "use strict";

  // Check for IndexedDB support and open the database
  var dbPromise = idb.open("couches", 5, function (updateDb) {
    if (updateDb.oldVersion < 1) {
      updateDb.createObjectStore("products", { keyPath: "id" });
    }
    
    if (updateDb.oldVersion < 2) {
      var store = updateDb.transaction.objectStore("products");
      store.createIndex("name", "name", { unique: false });
    }
    
    if (updateDb.oldVersion < 3) {
      var store = updateDb.transaction.objectStore("products");
      store.createIndex("price", "price");
    }
  });

  function addProducts() {
    dbPromise
      .then((db) => {
        var tx = db.transaction("products", "readwrite");
        var store = tx.objectStore("products");
        var items = [
          {
            name: "Couch",
            id: "cch-blk-ma",
            price: 499.99,
            color: "black",
            material: "mahogany",
            description: "A very comfy couch",
            quantity: 3,
          },
          {
            name: "Armchair",
            id: "ac-gr-pin",
            price: 299.99,
            color: "grey",
            material: "pine",
            description: "A plush recliner armchair",
            quantity: 7,
          },
          {
            name: "Stool",
            id: "st-re-pin",
            price: 59.99,
            color: "red",
            material: "pine",
            description: "A light, high-stool",
            quantity: 3,
          },
          {
            name: "Chair",
            id: "ch-blu-pin",
            price: 49.99,
            color: "blue",
            material: "pine",
            description: "A plain chair for the kitchen table",
            quantity: 1,
          },
          {
            name: "Dresser",
            id: "dr-wht-ply",
            price: 399.99,
            color: "white",
            material: "plywood",
            description: "A plain dresser with five drawers",
            quantity: 4,
          },
          {
            name: "Cabinet",
            id: "ca-brn-ma",
            price: 799.99,
            color: "brown",
            material: "mahogany",
            description: "An intricately-designed, antique cabinet",
            quantity: 11,
          },
        ];

        return Promise.all(
          items.map((item) => store.add(item))
        )
        .catch((err) => {
          tx.abort();
          console.error("Error adding products:", err);
        })
        .then(() => {
          console.log("Products added successfully");
        });
      })
      .catch((err) => {
        console.error("Error creating DB:", err);
      });
  }

  function getByName(name) {
    return dbPromise.then((db) => {
      var tx = db.transaction("products", "readonly");
      var store = tx.objectStore("products");
      var index = store.index("name");
      return index.get(name);
    });
  }

  function displayByName() {
    var name = document.getElementById("name").value;
    if (name === "") {
      return;
    }
    var s = "";
    getByName(name)
      .then(function (object) {
        if (!object) {
          s = "<p>No results.</p>";
        } else {
          s += "<h2>" + object.name + "</h2><p>";
          for (var field in object) {
            s += field + " = " + object[field] + "<br/>";
          }
          s += "</p>";
        }
      })
      .then(function () {
        document.getElementById("results").innerHTML = s;
      });
  }

  function getByPrice() {
    var lowerBound = parseFloat(document.getElementById("priceLower").value);
    var upperBound = parseFloat(document.getElementById("priceUpper").value);
    var range = IDBKeyRange.bound(lowerBound, upperBound);

    return dbPromise.then((db) => {
      var tx = db.transaction("products", "readonly");
      var store = tx.objectStore("products");
      var index = store.index("price");
      var s = "";

      return new Promise((resolve) => {
        var cursorRequest = index.openCursor(range);
        cursorRequest.onsuccess = function (event) {
          var cursor = event.target.result;
          if (cursor) {
            var object = cursor.value;
            s += "<h2>" + object.name + "</h2><p>";
            for (var field in object) {
              s += field + " = " + object[field] + "<br/>";
            }
            s += "</p>";
            cursor.continue();
          } else {
            resolve();
          }
        };
        cursorRequest.onerror = function (err) {
          console.error("Error getting products by price:", err);
          resolve();
        };
      }).then(function () {
        if (s === "") {
          s = "<p>No results.</p>";
        }
        document.getElementById("results").innerHTML = s;
      });
    });
  }

  function getByDesc() {
    var desc = document.getElementById("desc").value;
    if (desc === "") {
      return;
    }
    dbPromise.then((db) => {
      var tx = db.transaction("products", "readonly");
      var store = tx.objectStore("products");
      var s = "";

      return new Promise((resolve) => {
        var cursorRequest = store.openCursor();
        cursorRequest.onsuccess = function (event) {
          var cursor = event.target.result;
          if (cursor) {
            var object = cursor.value;
            if (object.description.includes(desc)) {
              s += "<h2>" + object.name + "</h2><p>";
              for (var field in object) {
                s += field + " = " + object[field] + "<br/>";
              }
              s += "</p>";
            }
            cursor.continue();
          } else {
            resolve();
          }
        };
        cursorRequest.onerror = function (err) {
          console.error("Error getting products by description:", err);
          resolve();
        };
      }).then(function () {
        if (s === "") {
          s = "<p>No results.</p>";
        }
        document.getElementById("results").innerHTML = s;
      });
    });
  }

  function addOrders() {
    // Implementation for addOrders
  }

  function showOrders() {
    // Implementation for showOrders
  }

  function getOrders() {
    // Implementation for getOrders
  }

  function fulfillOrders() {
    // Implementation for fulfillOrders
  }

  function processOrders(orders) {
    // Implementation for processOrders
  }

  function decrementQuantity(product, order) {
    // Implementation for decrementQuantity
  }

  function updateProductsStore(products) {
    // Implementation for updateProductsStore
  }

  return {
    dbPromise: dbPromise,
    addProducts: addProducts,
    getByName: getByName,
    displayByName: displayByName,
    getByPrice: getByPrice,
    getByDesc: getByDesc,
    addOrders: addOrders,
    showOrders: showOrders,
    getOrders: getOrders,
    fulfillOrders: fulfillOrders,
    processOrders: processOrders,
    decrementQuantity: decrementQuantity,
    updateProductsStore: updateProductsStore,
  };
})();
