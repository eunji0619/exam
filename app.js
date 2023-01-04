const express = require('express')
const path = require('path')
const logger = require('morgan')
const fs = require('fs')
const multer = require('multer')

const app = express()
const port = 3000
const _path = path.join(__dirname, '/dist')
console.log(_path)

app.use('/', express.static(_path))
app.use(logger('tiny'))
app.use(express.json())
app.use(
    express.urlencoded({
        extended: true
    })
)

app.get('/test', function (req, res) {
    res.send("아이디 : " + req.query.id + "<br>이름 : " + req.query.name)
})

app.post('/info', function (req, res) {
    const name = req.body.name; //이름
    const age = req.body.age;   //나이
    const inquiry = req.body.inquiry;   //문의사항

    fs.writeFile(_path + '/' + name + '.txt', "나이 : " + age + '\n' + "문의사항 : " + inquiry, (e) => {
        if (e) throw (e)
    })
    res.send(`<script>alert("${name}.txt 파일 저장 성공");location.replace('index.html')</script>`)
})

const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, _path)
    },
    filename: (req, res, cb) => {
        let fix = Buffer.from(res.originalname, 'latin1').toString('utf-8')
        cb(null, fix)
    }
})

let upload = multer({ storage: storage })

app.post('/download', upload.single('ufile'), (req, res, next) => {
    console.log(req.file)
    res.send(
        `<script>alert("파일 업로드 성공");location.replace('index.html')</script>` // history.go(-1)
    )
})

app.listen(port, () => {
    console.log(port + ' 로 연결되었습니다.')
})