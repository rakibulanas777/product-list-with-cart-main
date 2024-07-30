const food_container = document.getElementById("food_container");
const full_cart = document.getElementById("full_cart");

const fetchData = async () => {
  const response = await fetch("./data.json");
  const data = await response.json();
  let itemHTML = "";
  let cartData = [];
  data.forEach((item, index) => {
    itemHTML += `
      <div class="item_box">
        <div class="relative_box">
          <img
            src=${item.image.desktop}
            alt=""
            width="100%"
            class="rounded_img"
            srcset=""
          />
          <div class="btn_box" data-index="${index}" data-items='${JSON.stringify(
      item
    )}' >
            <img
              src="/assets/images/icon-add-to-cart.svg"
              alt=""
              srcset=""
            />
            <button class="cart_btn">add to cart</button>
          </div>
          <div class="btn_box_cart" id="btn_box_cart_${index}" style="display: none">
            <img
              src="/assets/images/icon-decrement-quantity.svg"
              alt=""
              width="20px"
              height="20px"
              class="decrement"
              data-index="${index}"
              data-items='${JSON.stringify(item)}'
              srcset=""
            />
            <button class="cart_btn_num" id="quantity_${index}">1</button>
            <img
              src="/assets/images/icon-increment-quantity.svg"
              alt=""
              width="20px"
              height="20px"
              class="increment"
              data-index="${index}"
              data-items='${JSON.stringify(item)}'
              srcset=""
            />
          </div>
        </div>
        <div class="company_name">${item.category}</div>
        <div class="title_food">${item.name}</div>
        <div class="price">$${item.price}</div>
      </div>
    `;
  });

  food_container.innerHTML = itemHTML;

  let cart = "";
  const addToCart = (item) => {
    const exist = cartData.find((x) => x.name === item.name);
    if (exist) {
      cartData = cartData.map((x) =>
        x.name === item.name ? { ...exist, qty: exist.qty + 1 } : x
      );
    } else {
      cartData = [...cartData, { ...item, qty: 1 }];
    }
    UpdateUi(cartData);
  };

  const removeFromCart = (itemName) => {
    cartData = cartData.filter((item) => item.name !== itemName);
    UpdateUi(cartData);
  };

  const UpdateUi = (data) => {
    const total_Price = data.reduce((a, c) => a + c.qty * c.price, 0);
    if (data.length === 0) {
      document.getElementById("empty_cart").style.display = "block";
      document.getElementById("cart_item_list").innerText =
        " You have emplty cart";
      document.getElementById("total_price").style.display = "none";
      document.getElementById("confrim_order").style.display = "none";
    } else {
      document.getElementById("empty_cart").style.display = "none";
      document.getElementById(
        "cart_item_list"
      ).innerText = `Your cart ${data.length}`;
      document.getElementById("total_price").style.display = "flex";
      document.getElementById("price_num").innerText = `$${total_Price}`;
      document.getElementById("confrim_order").style.display = "block";
      let order = "";
      document.getElementById("confrim_order").addEventListener("click", () => {
        // setTimeout(() => {
        //   document.getElementById("order_confrim").style.display = "none";
        // }, 5000);
        document.getElementById("order_confrim").style.display = "block";
        data.forEach((singleCart) => {
          order += ` <div class="order_cart_item">
                  <div class="order_cart_flex">
                    <img
                      src=${singleCart.image.desktop}
                      height="60px"
                      width="60px"
                      alt=""
                    />
                    <div class="middle">
                      <div class="order_item_cart">${singleCart.name}</div>
                      <div class="flex_price">
                        <span class="1x">${singleCart.qty} X </span>
                        <span class="total-price">$${(
                          singleCart.qty * singleCart.price
                        ).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  <div class="total_price">$${(
                    singleCart.qty * singleCart.price
                  ).toFixed(2)}</div>
                </div>
               `;
        });
        document.getElementById("order_cart").innerHTML = order;
        document.getElementById(
          "price_num_order"
        ).innerText = `$${total_Price}`;

        document.getElementById("new_order").addEventListener("click", () => {
          UpdateUi([]);
          cartData = [];
          document.getElementById("order_confrim").style.display = "none";
        });
      });
    }

    cart = "";

    data.forEach((singleCart) => {
      cart += `<div class="single_item">
                <div>
                  <div class="cart_item_title">${singleCart.name}</div>
                  <div class="flex_price">
                    <span class="1x">${singleCart.qty} X </span>
                    <span class="cart-price">${singleCart.price}</span>
                    <span class="total-price">${(
                      singleCart.qty * singleCart.price
                    ).toFixed(2)}</span>
                  </div>
                </div>
                <img
                  src="./assets/images/icon-remove-item.svg"
                  width="20px"
                  height="20px"
                  class="remove_btn"
                  data-name="${singleCart.name}"
                  alt="Remove item"
                />
              </div>`;
    });

    full_cart.innerHTML = cart;

    document.querySelectorAll(".remove_btn").forEach((removeBtn) => {
      removeBtn.addEventListener("click", (event) => {
        const itemName = event.currentTarget.getAttribute("data-name");
        removeFromCart(itemName);
      });
    });
  };

  document.querySelectorAll(".btn_box").forEach((btnBox) => {
    btnBox.addEventListener("click", (event) => {
      const item = JSON.parse(btnBox.dataset.items);
      addToCart(item);
      const index = btnBox.dataset.index;
      const cartBox = document.getElementById(`btn_box_cart_${index}`);
      cartBox.style.display = "flex";

      setTimeout(() => {
        cartBox.style.display = "none";
      }, 3000);
    });
  });

  document.querySelectorAll(".increment").forEach((incrementBtn) => {
    incrementBtn.addEventListener("click", (event) => {
      const item = JSON.parse(incrementBtn.dataset.items);
      addToCart(item);
      const index = event.target.dataset.index;
      const quantityElement = document.getElementById(`quantity_${index}`);

      let quantity = parseInt(quantityElement.textContent);
      quantityElement.textContent = ++quantity;
      cartData = cartData.map((x) =>
        x.name === item.name ? { ...x, qty: quantity } : x
      );
      UpdateUi(cartData);
    });
  });

  document.querySelectorAll(".decrement").forEach((decrementBtn) => {
    decrementBtn.addEventListener("click", (event) => {
      const item = JSON.parse(decrementBtn.dataset.items);
      const index = event.target.dataset.index;
      const quantityElement = document.getElementById(`quantity_${index}`);
      let quantity = parseInt(quantityElement.textContent);
      if (quantity > 1) {
        quantityElement.textContent = --quantity;
        cartData = cartData.map((x) =>
          x.name === item.name ? { ...x, qty: quantity } : x
        );
        UpdateUi(cartData);
      }
      if (quantity == 1) {
        cartData = cartData.filter((i) => i.name !== item.name);
        UpdateUi(cartData);
      }
    });
  });
};

fetchData();
