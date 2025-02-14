const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const port = process.env.PORT || 3000;
const sendGrid = require('@sendgrid/mail')
const mongoose = require('mongoose');
const req = require('express/lib/request');
const Schema = mongoose.Schema
const dotenv = require('dotenv')
dotenv.config()

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function connectToMongoose() {
    try {
        // await mongoose.connect('mongodb+srv://btilly:2022@cluster0.cpoyx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
        await mongoose.connect(process.env.MONGO_DB)
        console.log('Successfully connected')
    } catch (e) {
        console.log(e, 'Not connected')
    }
}

const ContactDetailsSchema = new Schema({
    plan: String,
    firstName: String,
    lastName: String,
    companyPosition: String,
    email: String,
    companyCategory: String,
    rtn: Number,
    companyCategory: String,
    companyAddress: String
})

const ContactDetails = mongoose.model('contactDetails', ContactDetailsSchema)

const homePageContactSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    message: String
})

const homePageContact = mongoose.model('homePageContact', homePageContactSchema)

connectToMongoose()
app.set('views', './views')
app.set('view engine', 'handlebars')
app.engine('handlebars', exphbs.create({}).engine)
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.listen(port, () => {
    console.log("Listening on" + port)
})
app.get('/', (req, res) => {
    res.render('index', { layout: false }, function (err, html) {
        if (err) {
            return console.log('A rendering error was found')
        }
        res.status(200).send(html)
    })
})
app.get('/auditoria', (req, res) => {
    res.render('auditoria', { layout: false })
})
app.get('/contabilidad', (req, res) => {
    res.render('contabilidad', { layout: false })
})
app.get('/consultoria', (req, res) => {
    res.render('consultoria', { layout: false })
})
app.get('/asesoria', (req, res) => {
    res.render('asesoria', { layout: false })
})
app.get('/tributarios', (req, res) => {
    res.render('tributarios', { layout: false })
})
app.get('/btilly-h', (req, res) => {
    res.render('btilly-h', { layout: false })
})
app.get('/carreras', (req, res) => {
    res.render('carreras', { layout: false })
})
app.get('/contactanos', (req, res) => {
    res.render('contactanos', { layout: false })
})
app.get('/landing-p-1', (req, res) => {
    res.render('landing-page', { layout: false })
})
app.get('/form', (req, res) => {
    res.render('form-page', { layout: false })
})
app.post('/calendly', async (req, res) => {
    try {
        const message = {
            to: req.body.email,
            from: 'ventas@bakertilly.hn',
            subject: `Gracias por registrarte`,
            html: `
          

    
                <h4> Hola ${req.body.firstName},</h4>
  
        <br>

        <div class="card" style="width: 40rem; background-color: grey;    background: #e7ff72;
        border-radius: 10px; padding: 10px;">
      
    
        <div class="card-body">
          <svg width="252" height="66" ><path d="M229.598 66c.215 0 1.419-.2 1.733-.248 5.892-.906 10.208-3.518 12.588-10.72C245.542 50.127 252 30.25 252 30.25h-6.858l-5.483 18.766h-1.104l-4.15-18.766h-7.124l6.939 24.615h3.74l-.261.877c-.8 2.741-5.045 4.595-8.981 5.11l.88 5.148zM162.28 54.85V35.795c.733-.248 2.546-.544 4.598-.544 1.075 0 2.784.081 3.664.181v-5.558c-.685-.195-2.536-.252-4.25-.252-4.307 0-8.414 1.125-10.565 2.154v23.076h6.553zm64.945-.014l.233-4.971c-.257.057-.962.214-1.628.214-2.222 0-2.875-1.444-2.875-3.427V19.687l-6.553 2.96V47.92c0 3.623 1.794 7.24 6.982 7.24 2.056 0 3.579-.271 3.84-.324zm-13.474 0l.233-4.971c-.257.057-.966.214-1.632.214-2.218 0-2.875-1.444-2.875-3.427V19.687l-6.553 2.96V47.92c0 3.623 1.794 7.24 6.986 7.24 2.056 0 3.58-.271 3.841-.324zm-23.515.015V30.217l6.558.033v24.6h-6.558zm3.231-27.518c-2.003 0-3.521-.782-3.521-3.623 0-2.598 1.37-3.675 3.521-3.675 2.204 0 3.617.834 3.617 3.627 0 2.694-1.318 3.67-3.617 3.67zm-47.435 12.474v-.538c0-3.332-1.47-4.848-5.059-4.848-3.67 0-5.12 2.007-5.22 5.386h10.28zm-2.998 10.191c3.684 0 5.968-.815 7.105-1.163l.638 4.9c-.956.439-4.093 1.75-8.152 1.75-8.905 0-13.521-4.572-13.521-13.39 0-8.918 4.416-12.527 12.04-12.527 8.31 0 10.951 4.605 10.951 12.398 0 .83-.047 2.007-.142 2.446h-16.296c0 4.447 3.27 5.586 7.377 5.586zm-29.512 4.853V44.02h1.561l7.92 10.83h7.333l-10.18-14.305 9.267-10.296h-7.163l-7.344 8.284h-1.394V19.687l-6.553 2.96v32.204h6.553zm67.367.31c2.608 0 4.302-.406 4.583-.482l.295-5.043c-.224.09-1.49.443-2.294.443-3.013 0-3.964-2.14-3.964-4.98v-9.015h7V30.25h-7v-5.253l-6.482 2.96v18.986c0 5.644 2.94 8.218 7.862 8.218zm-84.88-10.616c-1.181-.19-3.356-.505-5.165-.505-4.25 0-4.607 1.764-4.607 3.299 0 2.497 1.133 3.417 4.779 3.417 2.384 0 4.112-.381 4.992-.624v-5.587zm-5.384 10.916c-8.262 0-10.589-2.593-10.589-7.96 0-5.477 2.399-7.923 10.37-7.923 2.509 0 4.855.372 5.602.477V38.42c0-1.973-1.042-3.413-6.277-3.413-4.165 0-6.516 1.187-7.334 1.506l-.51-5.09c1.086-.43 4.54-1.855 9.705-1.855 7.762 0 10.87 3.318 10.87 9.705v14.31c-1.857.83-6.635 1.878-11.837 1.878zm-26.209-5.3c5.102 0 6.663-2.899 6.663-7.618 0-4.576-1.632-7.483-6.663-7.483-1.465 0-2.793.29-4.36.781V49.38c1.138.371 2.757.781 4.36.781zM53.502 22.646l6.554-2.96v10.959c1.713-.539 3.065-1.078 6.487-1.078 7.424 0 11.032 3.961 11.032 12.975 0 10.563-4.14 12.942-13.655 12.942-4.55 0-8.461-.787-10.418-1.664V22.647zM29.692 1.274C27.32-.067 21.81-.309 17.936.359c-3.555.616-7.077 1.854-10.141 3.768C3.611 6.74.632 10.801.099 15.754c-.51 4.683 1.01 9.414 3.312 13.457 2.416 4.233 5.804 8.01 9.86 10.75 3.988 2.692 8.725 4.28 13.543 3.143.886-.209 1.816-.493 2.545-1.048-.305.048-.62.09-.93.114-9.087.758-16.57-6.901-19.69-14.703-1.654-4.124-2.255-8.76-.973-13.073 1.22-4.086 4.013-7.47 7.649-9.674 4.16-2.526 9.393-3.773 14.254-3.37l.023-.076zm6.963 18.874a9.72 9.72 0 0 0-10.646.01c-3.012 1.981-4.508 5.621-3.665 9.143.853 3.565 3.817 6.295 7.449 6.916 1.83.308 3.75.085 5.446-.683.2-.09.463-.175.64-.313.142-.113.214-.313.304-.474.22-.412.434-.834.63-1.256.38-.81.719-1.635 1.024-2.479a32.758 32.758 0 0 0 1.734-7.588c.034-.327-.071-.441-.262-.707a8.504 8.504 0 0 0-.438-.564 10.234 10.234 0 0 0-2.216-2.005zM30.569 7.114c2.75.73 5.142 2.35 6.796 4.654a13.813 13.813 0 0 1 1.935 3.887c.514 1.621.49 3.394.448 5.076-1.887-3.303-5.562-5.26-9.36-5.204-3.116.047-6.11 1.578-8.058 3.991-2.02 2.503-2.926 5.854-2.397 9.025.538 3.251 2.611 6.176 5.523 7.74 2.969 1.602 6.62 1.716 9.66.251a18.963 18.963 0 0 1-2.064 2.63c-.343.361-.7.82-1.177.996-.538.195-1.096.346-1.668.455-2.244.427-4.599.11-6.734-.668-3.693-1.35-6.68-4.133-8.844-7.347-2.154-3.204-3.684-6.972-3.97-10.84-.276-3.75.758-7.518 3.364-10.305 2.726-2.905 6.71-4.29 10.604-4.716 1.982-.213 4.008-.133 5.942.375z" fill="#231f20" fill-rule="evenodd"/></svg>
          <br>
          <h2>Gracias por contactarnos</h2>
          <p >Estas un paso más cerca de adquirir un plan contable que mejor se adapte a las necesidades de
            su negocio.
            Puedes conocer más sobre nuestro equipo de expertos en el siguiente enlace:</p>
          <center><a  target="_blank" href="http://www.bakertilly.hn" style="text-decoration: none;color: white;"><div style=" border-radius: 5px;  width: 175px;height: 50px; background-color: black;font-weight: bold;"><br><span>Ir a Bakertilly</span></div></a>
        </center>
          </div>
      </div>
     
    <br>
      <p style="font-size: 0.8rem; font-style: italic;"><i style="color: red;">*</i>&nbsp; Este mensaje se envió desde una dirección de solo notificación que no puede aceptar respuestas entrantes. 
        Puedes ponerte en contacto con nosotros en cualquier momento llamando al (+504) 2239-2663.
        Colonia Humuya, Sendero Ámbito, 2da Calle, Tegucigalpa, Honduras</p>
    
            `
        }
        let contact = new ContactDetails(req.body)
        console.log(req.body.email)
        await contact.save()
        await sendGrid.send(message)
        res.render('calendly', { layout: false })
    } catch (e) {
        res.status(404).send('Ha ocurrido un error', e)
    }
})

app.post('/contact', async (req, res) => {

    try {
        const message = {
            to: req.body.email,
            from: 'ventas@bakertilly.hn',
            subject: `Confirmación de Recepción`,
            html: `
                <h5>Estimado(a) ${req.body.firstName}</h5>
                <p>
                    Gracias por ponerse en contacto. Nuestro equipo se comunicará con usted por este mismo medio dentro de las próximas 24 horas.
                </p>
                <p>
                    Puede ponerse en contacto con nosotros en cualquier momento llamando al (+504) 2239-2663.
                    Colonia Humuya, Sendero Ámbito, 2da Calle, Tegucigalpa, Honduras
                </p>`
        }
        let contact = new homePageContact(req.body)
        await contact.save()
        await sendGrid.send(message)
        res.send('Form submitted')
    } catch (e) {
        res.send('there was an error')
    }
})

