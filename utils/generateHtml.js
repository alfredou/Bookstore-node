function generateEmailHTML(products) {
    // Genera el contenido HTML del correo electrónico dinámicamente
    const productHTML = products?.map((product, index)=>{
        return `<div key={${product.id}} className="order__productcontainer">
                    <img src={${product.image}} alt={${product.title}} width="100px" height="100px"/>
                    <div className="order__productinfo">
                      <h2 className="order__producttitle">{${product.title}}</h2>
                      <div className="order__productquantity">
                          <h2>quantity:</h2>
                          <h2>{${product.quantity}}</h2>
                      </div>
                      <div className="order__productprice">
                          <h2>price:</h2>
                          <h2>{${product.price}}</h2>
                      </div>
                    </div>
               </div>`
       }).join('');
  
    // Retorna el contenido completo del correo electrónico
    return `
      <html>
        <body>
          <h1>Order details</h1>
          <div className="order__products">
                ${productHTML}
          </div>
        </body>
      </html>
    `;
  }
  
  module.exports = { generateEmailHTML }