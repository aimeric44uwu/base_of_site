const baseurl = document.getElementById("indexscript").getAttribute("data-baseurl")
const logged = document.getElementById("indexscript").getAttribute("data-logged")


function updatecart() {
    if(logged != "true") return;
    document.getElementById("totalpricedisplay").innerHTML = 0 + " €"
    $.ajax({
        type: "GET",
        url: "/api/Cartitem",
        dataType: "json",
        processData: false,
        success: function (response) {

            var element = document.getElementById("articleelement");
            var numberofarticle = 0;
            var totalprice = 0;
            element.innerHTML = ""

            for (var eacharticle = 0; eacharticle < Object.keys(response).length; eacharticle++) {
                totalprice += response[eacharticle].price
                numberofarticle++
                let articlehtml = ` 
                  <li class="clearfix">
                    <img src="${baseurl}/img/${response[eacharticle].img}" alt="item1" style="max-width: 60px;max-width: 60px;" />
                    <span class="item-name">${response[eacharticle].name}</span>
                    <span class="item-price">${response[eacharticle].price} €</span>
                    <span class="item-quantity">quantité: ${response[eacharticle].quantity} ml</span>
                  </li>`
          element.innerHTML += articlehtml;
        }
        if (!totalprice) totalprice = 0
        if (numberofarticle > 0) {
          document.getElementById("confirmbutton").style.display = "";
        }

        document.getElementById("totalpricedisplay").innerHTML = totalprice + " €"
        document.getElementById("numberofarticle").innerHTML = numberofarticle
        document.getElementById("numberofarticlenavbar").innerHTML = numberofarticle

      }
    })
}
updatecart()

function updateproduct(responseproduct) {

    document.getElementById("productelement").innerHTML = ""
    for (var i = 0; i < Object.keys(responseproduct).length; i++) {
        let articlehtml = `
        <form id="${responseproduct[i][0].name}form">
          <div class="col">
            <div class="card">
              <img class="card-img-top" src="${baseurl}/img/${responseproduct[i][0].img}" alt="Card image cap">
              <div class="card-block">
                <h4 class="card-title">${responseproduct[i][0].name}</h4>
                <input type="hidden" name="productId" value="${responseproduct[i][0].id}">
                <input type="hidden" name="name" value="${responseproduct[i][0].name}">
                <p class="card-text" id="${responseproduct[i][0].name}unit">Price: ${responseproduct[i][0].priceatml * 5} €</p>
                <p class="card-text">${responseproduct[i][0].description}</p>
                <select class="soflow-color" name="quantity" id="${responseproduct[i][0].name}quantityselected" onchange="${responseproduct[i][0].name}()" ></select> 
                <a onclick="${responseproduct[i][0].name}basket()" data-name="${responseproduct[i][0].name}" class="add-to-cart btn btn-primary">ajouter au panier</a>
              </div>
            </div>
          </div>
        </form>`

        let myScript = document.createElement("script");
        myScript.innerText = `

        function ${responseproduct[i][0].name}() {
          var newprice = document.getElementById('${responseproduct[i][0].name}quantityselected').selectedOptions[0].value * 
            ${responseproduct[i][0].priceatml};document.getElementById("${responseproduct[i][0].name}unit").innerHTML = 
          "Price: " + newprice  + "€"
        }
        
        function ${responseproduct[i][0].name}basket() {
          $.ajax({type: 'POST',url: '/',data: $("#${responseproduct[i][0].name}form").serialize(),dataType: 
            "json",success: (response) => {
              setTimeout(() => {
                document.getElementById("notloggedalert").style.display = "none";
              }, 3000);
            if (response.status == "unlogged") {
              document.getElementById("notloggedalert").style.display = "";
            };
          },
          error: () => {}
          });
        updatecart()
        };`
      
        document.getElementById("productelement").innerHTML += articlehtml

        for (var y = 0; y < responseproduct[i][0].quantityavaliable.length; y++) {
        
            document.getElementById(`${responseproduct[i][0].name}quantityselected`).innerHTML += 
            `<option value="${responseproduct[i][0].quantityavaliable[y].quantity}">
                ${responseproduct[i][0].quantityavaliable[y].quantity} ml
            </option>`
        }
        document.getElementById("productelement").appendChild(myScript)
    }
}

$.ajax({
    type: "GET",
    url: baseurl + "/api/productitem",
    dataType: "json",
    processData: false,
    success: function (rsp) {
        updateproduct(rsp)
    }
})

////////////////////////////
// Twitter: @mikedevelops
////////////////////////////
var input = document.getElementById("search");
var ph = "cherchez des gouts ex: \"cerise\"";
var searchBar = $('#search');
var phCount = 0;

input.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("submitbigbutton").click();
    }
});

function randDelay(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function printLetter(string, el) {
    var arr = string.split(''),
        input = el,
        origString = string,
        curPlace = $(input).attr("placeholder"),
        placeholder = curPlace + arr[phCount];
    setTimeout(function () {
        $(input).attr("placeholder", placeholder);
        phCount++;
        if (phCount < arr.length) {
            printLetter(origString, input);
        }
    }, randDelay(50, 90));
}

function placeholder() {
    $(searchBar).attr("placeholder", "");
    printLetter(ph, searchBar);
}
placeholder();

$('.submitbigbutton').click(function (e) {
    phCount = 0;
    e.preventDefault();
    placeholder();
    event.preventDefault();
    $.ajax({
        type: 'POST',
        url: baseurl + '/api/productitem',
        data: $('#search').serialize(),
        dataType: "json",
        success: (srchitem) => {
            updateproduct(srchitem)
        }
    })
    document.getElementById("search").value = ""
});

(function () {
    $("#cart").on("click", function () {
        $(".shopping-cart").fadeToggle("fast");
    });
})();
