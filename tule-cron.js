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
	init: function(){
		// Register this module as util
		config.register( 'cron', Path.join(__dirname, Path.basename( __filename, '.js' ) ) );
	},

	checkCrons: function(){
		var me = this;

		return Q.nfcall( fs.readdir.bind( fs, config.cron.cronsPath ))
			.then( function( files ){
				files.forEach( function( file ){
					if( Path.extname( file ) == '.js' && !me.crons[ file ] )
						me.addCron( Path.join(config.cron.cronsPath, file ) );
				});
			})
			.catch( function( e ){
				logger.error( e.stack );
			})
		;
	},

	addCron: function( filepath ){
		try {
			var cron = require( filepath );

			if( !cron || !cron.job )
				return logger.error( 'Cron has no job', {filename: filepath} );

			var interval = cron.interval || config.cron.defaultInterval,
				job = new CronJob( interval, cron.job )
			;

			this.crons[ filepath ] = {
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
	},

	addJob: function( interval, handler ){
		console.log( 'Starting cron ' + interval );
		return new CronJob( interval, handler );
	}
};

var cronRegisterer = new CronRegisterer();

module.exports = cronRegisterer;