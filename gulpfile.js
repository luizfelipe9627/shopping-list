// Está armazenando o pacote que foi instalado no src, dest, watch e parallel.
const gulp = require("gulp");

// Está fazendo a requisição das dependências.
const sass = require("gulp-sass")(require("sass"));
const browserify = require("browserify");
const babelify = require("babelify");
const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");
const uglify = require("gulp-uglify");
const connect = require("gulp-connect");
const htmlmin = require("gulp-htmlmin");

// Objeto responsável por armazenar os diretórios principais.
const paths = {
    html: {
        all: "./src/templates/**/*.html",
    },
    styles: {
        all: "./src/styles/**/*.scss",
        main: "./src/styles/partials/main.scss",
    },
    scripts: {
        all: "./src/scripts/**/*.js",
        main: "./src/scripts/app.js",
    },
    output: "./dist",
};

// Responsável por fazer a hospedagem local.
function server() {
    connect.server({
        // Pasta que vai ser direcionada.
        root: paths.output,
        // Irá atualizar a cada modificação.
        livereload: true,
        // Porta do site.
        port: 3000,
    });
}

// Responsável por monitorar modificações nos arquivos.
function sentinel() {
    // Como primeiro parâmetro irá ficar monitorando todos os arquivos SCSS, como segundo vai sempre ler os arquivos e como terceiro vai executar a função styles toda vez que sentinel for executada.
    gulp.watch(paths.html.all, { ignoreInitial: false }, html);
    gulp.watch(paths.styles.all, { ignoreInitial: false }, styles);
    gulp.watch(paths.scripts.all, { ignoreInitial: false }, scripts);
}

// Responsável por gerar o arquivo HTML.
function html() {
    // Retorna o caminho do HTML.
    return (
        gulp.src(paths.html.all)
            // Minifica o HTML.
            .pipe(htmlmin({ collapseWhitespace: true }))
            // Cria e armazena o arquivo do diretório dist.
            .pipe(gulp.dest(paths.output))
    );
}

// Responsável por gerar o arquivo CSS.
function styles() {
    // Retorna o caminho para os arquivos iniciais/de origem.
    return (
        gulp.src(paths.styles.main)
            // O pipe está sendo usado para criar um caminho dentro do gulp.
            // Dentro do SASS foi criado um estilo de compresso, que é para ele minificar o arquivo.
            .pipe(
                sass({ outputStyle: "compressed" })
                    // Caso de erro(on) ele vai retornar um log de error.
                    .on("error", sass.logError)
            )
            // O pipe está sendo usado para criar um caminho dentro do gulp.
            // O dest está sendo usado para criar a pasta dist com o arquivo dentro chamado main.css.
            .pipe(gulp.dest(paths.output))
            // Responsável por atualizar/recarregar a página.
            .pipe(connect.reload())
    );
}

// Responsável por gerar o aquivo JS.
function scripts() {
    // O browserify é responsável por obter o código do app.js.
    return (
        browserify(paths.scripts.main)
            // Usado para transformar o arquivo.
            .transform(
                // Faz a conversão para o javascript mais moderno.
                babelify.configure({
                    presets: ["@babel/preset-env"],
                })
            )
            // O bundle é responsável por fazer a conversão do arquivo para o source.
            .bundle()
            // O pipe está sendo usado para criar um caminho dentro do gulp.
            // O source serve para enviar o arquivo, nesse caso será enviado/criado o bundle.js.
            .pipe(source("bundle.js"))
            // O pipe está sendo usado para criar um caminho dentro do gulp.
            // O buffer serve para fazer a conversão do arquivo para o uglify executar corretamente.
            .pipe(buffer())
            // O pipe está sendo usado para criar um caminho dentro do gulp.
            // Responsável por minificar o arquivo JS.
            .pipe(uglify())
            // O pipe está sendo usado para criar um caminho dentro do gulp.
            // Cria a pasta dist com o arquivo dentro chamado bundle.js.
            .pipe(gulp.dest(paths.output))
            // O pipe está sendo usado para criar um caminho dentro do gulp.
            // Responsável por atualizar/recarregar a página.
            .pipe(connect.reload())
    );
}

// Está criando um export chamado build que é responsável por disparar três funções ao mesmo tempo.
exports.build = gulp.parallel(html, styles, scripts);
// Está criando um export chamado default que é responsável por disparar duas funções ao mesmo tempo.
exports.default = gulp.parallel(server, sentinel);
