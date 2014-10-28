/*
This is an example of a cron job.
Exporting an object like the one below creates a scheduled job.
 */

module.exports = {
	/**
	 * If disabled, the job won't be added to the schedule.
	 * Useful to disable some jobs without deleting them.
	 * @type {Boolean}
	 */
	disabled: true,

	/**
	 * When the job has to be run. Can be a string with cron format, see
	 * https://github.com/ncb000gt/node-cron#usage-basic-cron-usage
	 *
	 * Or a javascript date to execute a job once.
	 *
	 * @type {String|Date}
	 */
	interval: ' */10 * * * * *',

	/**
	 * The function to be exected
	 * @return {undefined}
	 */
	job: function() {
		console.log( 'CROOOOOOOOOOOOOOOOOOOOOOOOOOON' );
	},

	/**
	 * Wether to execute the job just after is added to the schedule.
	 * @type {Boolean}
	 */
	runOnAdding: true
};