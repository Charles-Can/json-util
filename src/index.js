import fs from 'fs-extra';
import path from 'path';
import glob from 'glob';
import Table from 'ascii-table';
import chalk from 'chalk';
import nw from 'node-watch';
import Promise from 'promise';
import asciify from 'asciify';

asciify('Translation Tool! v1.0', {font:'eftitalic', color: 'yellow'}, function(err, res){ console.log(res) });

const config = path.join(__dirname , '..', './config.json');

(() => {
    extractConfig(config)
      .then(con => {
        //run once initially
        getFiles(con);
        //watch dir
        nw(con.src , { filter: /\.json$/ }, () => getFiles(con));
      });
})();

function extractConfig(source) {
  return fs.readFile(source, { encoding: 'utf-8' })
    .then( data => JSON.parse(data) )
    .catch(console.error);    
}

function getFiles(source) {
  glob(source.src + '*.json', function( err, files) {
    let table = new Table(`results for ${source.src}`)
      .setHeading(['file', ...source.keys]);
    let validations = files.map( file => validateFile( file, source.keys ) );
    Promise.all( validations )
      .then( p => {
        p.map( v => table.addRow( v ) );
        let message = table.toString();
        message = message.replace( /found/g, chalk.green('found') );
        message = message.replace( /missing/g, chalk.red('missing') );
        console.log( message );
      })
      .catch( console.error );
  });
}

function validateFile(file, keys) {
  return fs.readFile( file, { encoding: 'utf-8' } )
    .then( data => JSON.parse( data ) )
    .then( obj => validateKeys( file, obj, keys ) )
    .catch( console.error );
}

function validateKeys(file, obj, keys) {
  let missing;
  missing = keys.map( key => (obj.hasOwnProperty(key)) ? 'found' : 'missing');
  return [file.split(path.sep).reduce( (t,n) => n, '' ), ...missing];
} 
