//para mañana deployar front en vercel y agregarle lo que falta estructura de carpetas a este en los componentes antes de deployarlo o deployarlo asi como esta y luego agregar el websocket en stripe y integrar el dominio de email con sus dns etc. para mañana debe estar terminado.
//const { Resend } = require('resend');
//const { generateEmailHTML } = require('../utils/generateHtml')
/*
to='user@gmail.com'
const products = [
     {
        id: "9781912047451",
        title: "An Introduction to C & GUI Programming, 2nd Edition",
        quantity: 1,
        image: "https://itbook.store/img/books/9781912047451.png",
        price: 14.92
    }
  ];
  */
//const resend = new Resend(process.env.MAIL_KEY);
/*
async function sendMail(to, products) {
  try {
    const emailHTML = generateEmailHTML(products)

    if(emailHTML){
    const data = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: [`${to}`],
            subject: 'You have bought',
            html: emailHTML,
           });
    console.log(data);
   }
 } catch (error) {
    console.error(error);
  }
}

module.exports = {sendMail}*/