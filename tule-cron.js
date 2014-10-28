var config = require('config'),
	fs = require('fs'),
	Q = require('q'),
	Path = require('path'),
	logger = require('winston'),
	CronJob = require('cron').CronJob
;

config.cron = {
	cronsPath: config.path.plugins + '/tule-cron/crons',
	defaultInterval: '00 * * * * *'
};

var CronRegisterer = function(){
	this.crons = {};
	this.checkCrons();
};

CronRegisterer.prototype = {
	checkCrons: function(){
		var me = this;

		return Q.nfcall( fs.readdir.bind( fs, config.cron.cronsPath ))
			.then( function( files ){
				files.forEach( function( file ){
					if( Path.extname( file ) == '.js' && !me.crons[ file ] )
						me.addCron( file );
				});
			})
			.catch( function( e ){
				logger.error( e.stack );
			})
		;
	},

	addCron: function( filename ){
		try {
			var cron = require( Path.join(config.cron.cronsPath, filename) );

			if( !cron || !cron.job )
				return logger.error( 'Cron has no job', {filename: filename} );

			var interval = cron.interval || config.cron.defaultInterval,
				job = new CronJob( interval, cron.job )
			;

			this.crons[ filename ] = {
				job: job,
				method: cron.job,
				interval: interval
			};

			if( cron.runOnAdding ){
				cron.job();
			}
		}
		catch (e) {
			return logger.error( 'Cron error', e.stack );
		}
	}
};

module.exports = {
	init: function( ){
		new CronRegisterer();
	}
};