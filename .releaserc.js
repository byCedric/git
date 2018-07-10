const commitTypes = require('commit-types-peakfijn');

module.exports = {
	branch: 'master',
	repositoryUrl: 'https://github.com/bycedric/semantic-release-git-branches.git',
	tagFormat: '${version}',
	analyzeCommits:{
		path: '@semantic-release/commit-analyzer',
		preset: 'peakfijn',
		releaseRules: Object.keys(commitTypes)
			.map(type => ({ type, release: commitTypes[type].release }))
			.filter(rule => !!rule.release),
	},
	generateNotes: [
		{
			path: '@semantic-release/release-notes-generator',
			preset: 'peakfijn',
		},
	],
	verifyConditions: [
		'@semantic-release/changelog',
		'@semantic-release/npm',
		'./lib/verify',
	],
	prepare: [
		'@semantic-release/changelog',
		'@semantic-release/npm',
		{
			path: './lib/prepare',
			message: 'chore: create new release ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
			branchMerges: [
				'develop',
				'master',
			],
		},
	],
};
