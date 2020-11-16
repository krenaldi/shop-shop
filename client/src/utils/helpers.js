export function pluralize(name, count) {
  if (count === 1) {
    return name
  }
  return name + 's'
}

export function idbPromise(storeName, method, object) {
  return new Promise((resolve, reject) => {
    // open connection to db 'shop-shop' with the version of 1
    const request = window.indexedDB.open('shop-shop', 1);

    // create variables to hold reference to db, transaction (tx), & object store
    let db, tx, store;

    // if version has changed or if first time using the db, run this method & create the 3 obj stores
    request.onupgradeneeded = function (e) {
      const db = request.result;
      // create obj store for each type of data & set primary key index to be the '_id' of the data
      db.createObjectStore('products', { keyPath: '_id' });
      db.createObjectStore('categories', { keyPath: '_id' });
      db.createObjectStore('cart', { keyPath: '_id' });
    };

    // handle any errors with connecting
    request.onerror = function (e) {
      console.log('There was an error');
    };

    // on database open success
    request.onsuccess = function (e) {
      // save a reference of db to the 'db' variable
      db = request.result;
      // open a transaction to whatever we pass into 'storeName' (must match one of the obj store names)
      tx = db.transaction(storeName, 'readwrite');
      // save a reference to that obj store
      store = tx.objectStore(storeName);
      // if there's any errors, let us know
      db.onerror = function (e) {
        console.log('error', e);
      };

      // check value that's passed into function as a method & perform that method on the obj store
      switch (method) {
        case 'put':
          store.put(object);
          resolve(object);
          break;
        case 'get':
          const all = store.getAll();
          all.onsuccess = function() {
            resolve(all.result);
          }
          break;
        case 'delete':
          store.delete(object._id);
          break;
        default:
          console.log('No valid method');
          break;
      }

      // when the transaction is complete, close the connection
      tx.oncomplete = function () {
        db.close();
      };
    };

  });
}