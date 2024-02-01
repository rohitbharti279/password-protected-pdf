let express = require('express')
let multer = require('multer')
let {spawn} = require('child_process')

let app = express()

app.use(express.urlencoded({extended:false}))
app.use(express.json())

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  });
  
  var upload = multer({ storage: storage }).single('file');

app.use(express.static('public'))

app.post('/encryptpdf',(req,res) => {
    upload(req,res,(err) => {
        if(req.file) {
            let outputfile = Date.now() + "output.pdf"
            let password = req.body.password
            console.log(password)
            let process = spawn("python", ["app.py", req.file.path, outputfile, password])

            process.on('exit', (code) => {
                if (code == 0){
                    res.download(outputfile, (err) => {

                    })
                }
            })
                
        }

    })
})

app.listen(5000)