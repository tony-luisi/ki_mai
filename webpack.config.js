module.exports = {
 entry: {
   bundle: "./src/index.js",
   words: './src/words.js'
 },
 output: {
     path: __dirname+'/public/javascripts',
     filename: "[name].js"
 },
 module: {
   // preLoaders: [
   //   {
   //     test: /\.js$/,
   //     exclude: /node_modules/,
   //     loader: 'jshint-loader'
   //   }
   // ],
   loaders: [
     {
       test: /\.js$/,
       exclude: /node_modules/,
       loader: 'babel-loader',
       query: {
         cacheDirectory: true,
         presets: ['react', 'es2015']
       }},
       { test: /\.jade$/, loader: "jade" }
   ]
 },
 resolve: {
   extensions: ['', '.js', '.es6']
 },
 watch: true
}



// module.exports = {
//     entry: "./js/script.js",
//     output: {
//         path: __dirname,
//         filename: "/js/bundle.js"
//     },
//     module: {
//         loaders: [
//             { test: /\.css$/, loader: "style!css" }
//         ]
//     },
//     watch: true
// }
