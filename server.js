import express          from 'express';
import {TemplateEngine, STANDARD_CONFIGURATION} from 'thymeleaf';
import fs               from 'fs';
import path             from 'path';

let app = express();
let templateEngine = new TemplateEngine(STANDARD_CONFIGURATION);

// app.use(express.logger('dev'));
// app.use(express.bodyParser());
// app.use(express.cookieParser());

let defaultFolderContent = 'src/';

app.all('*', (req, res) => {

    sendFile(req, res) || sendTemplate(req, res) || sendNotFound(req, res);
});

let sendFile = (req, res) => {
    let staticFile = defaultFolderContent + req.originalUrl.substr(1);
    console.log(staticFile);
    console.log(path.join(__dirname, defaultFolderContent));

    if (req.originalUrl.substr(-1) != "/" && fs.existsSync(staticFile)) {
        res.sendFile(staticFile, { root: path.join(__dirname) });
        return true;
    }
};

let sendTemplate = (req, res) => {
    let templateFile = defaultFolderContent + getTemplateFileByURL(req.originalUrl);
    console.log(templateFile)

    if (fs.existsSync(templateFile)) {
        templateEngine.processFile( templateFile, { username: 'Gustavo!' })
            .then(result => {
                res.send(result);
            });
        return true;
    }
};

let sendNotFound = (req, res) => {
    res.send('File not found');
    return true;
};

let getTemplateFileByURL = (url) => {
    let templateFile = url.substr(1);
    if( url.substr(-1) == "/" ) {
        templateFile += "index";
    }
    templateFile += '.html';
    return templateFile;
}

// start listening
app.listen(3000);
