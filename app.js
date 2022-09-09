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
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css" rel="stylesheet"
    integrity="sha384-iYQeCzEYFbKjA/T2uDLTpkwGzCiq6soy8tYaI1GyVh/UjpbCx/TYkiZhlZB6+fzT" crossorigin="anonymous">

    
                <h4> Hola ${req.body.firstName},</h4>
        <br><br>
                <div class="card" style="width: 40rem; background-color: grey;    background: #e7ff72;
                border-radius: 10px;">
                <!-- la url de la img es termporal-->
            
                <div class="card-body">
                  <img src="http://www.bakertilly.hn/images/logo.svg">
                  <br>
                  <h5 class="card-title">Gracias por contactarnos</h5>
                  <p class="card-text">Estas un paso más cerca de adquirir un plan contable que mejor se adapte a las necesidades de
                    su negocio.
                    Puedes conocer más sobre nuestro equipo de expertos en el siguiente enlace:</p>
                  <a target="_blank" href="http://www.bakertilly.hn" class="btn btn-primary" style="background-color: black;">Ir a Bakertilly hn</a>
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

