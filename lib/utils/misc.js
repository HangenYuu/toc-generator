"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getArrayInput = exports.cleanPath = exports.homeExpanded = exports.getRunnerArguments = exports.getEntryPrefix = exports.getMaxHeaderLevel = exports.isFolding = exports.isNoTitle = exports.replaceDirectory = void 0;
const path_1 = require("path");
const os_1 = require("os");
const github_action_helper_1 = require("@technote-space/github-action-helper");
const github_action_log_helper_1 = require("@technote-space/github-action-log-helper");
const core_1 = require("@actions/core");
const doctoc_1 = require("./doctoc");
const constant_1 = require("../constant");
const replaceDirectory = (message) => {
    const workDir = (0, path_1.resolve)(github_action_helper_1.Utils.getWorkspace());
    return [
        { key: ` -C ${workDir}`, value: '' },
        { key: workDir, value: '[Working Directory]' },
    ].reduce((value, target) => github_action_helper_1.Utils.replaceAll(value, target.key, target.value), message);
};
exports.replaceDirectory = replaceDirectory;
const getTargetPaths = () => github_action_helper_1.Utils.getArrayInput('TARGET_PATHS', true).filter(target => target && !target.startsWith('/') && !target.includes('..'));
const getTocTitle = () => (0, core_1.getInput)('TOC_TITLE');
const isNoTitle = (title) => '' === title;
exports.isNoTitle = isNoTitle;
const isFolding = () => github_action_helper_1.Utils.getBoolValue((0, core_1.getInput)('FOLDING'));
exports.isFolding = isFolding;
const getMaxHeaderLevel = () => /^\d+$/.test((0, core_1.getInput)('MAX_HEADER_LEVEL')) ? Number.parseInt((0, core_1.getInput)('MAX_HEADER_LEVEL')) : undefined;
exports.getMaxHeaderLevel = getMaxHeaderLevel;
const getEntryPrefix = () => (0, core_1.getInput)('ENTRY_PREFIX');
exports.getEntryPrefix = getEntryPrefix;
const getExecuteCommands = (logger) => {
    const paths = getTargetPaths();
    if (!paths.length) {
        logger.warn('There is no valid target. Please check if [TARGET_PATHS] is set correctly.');
        return [];
    }
    const title = getTocTitle().replace('\'', '\\\'').replace('"', '\\"');
    return [(0, doctoc_1.doctoc)(paths, title, logger)];
};
const getRunnerArguments = () => {
    const logger = new github_action_log_helper_1.Logger(exports.replaceDirectory);
    return {
        rootDir: (0, path_1.resolve)(__dirname, '../..'),
        logger,
        actionName: constant_1.ACTION_NAME,
        actionOwner: constant_1.ACTION_OWNER,
        actionRepo: constant_1.ACTION_REPO,
        executeCommands: getExecuteCommands(logger),
        commitMessage: (0, core_1.getInput)('COMMIT_MESSAGE'),
        commitName: (0, core_1.getInput)('COMMIT_NAME'),
        commitEmail: (0, core_1.getInput)('COMMIT_EMAIL'),
        prBranchPrefix: (0, core_1.getInput)('PR_BRANCH_PREFIX'),
        prBranchName: (0, core_1.getInput)('PR_BRANCH_NAME'),
        prTitle: (0, core_1.getInput)('PR_TITLE'),
        prBody: (0, core_1.getInput)('PR_BODY'),
        prBranchPrefixForDefaultBranch: (0, core_1.getInput)('PR_DEFAULT_BRANCH_PREFIX'),
        prBranchNameForDefaultBranch: (0, core_1.getInput)('PR_DEFAULT_BRANCH_NAME'),
        prTitleForDefaultBranch: (0, core_1.getInput)('PR_DEFAULT_BRANCH_TITLE'),
        prBodyForDefaultBranch: (0, core_1.getInput)('PR_DEFAULT_BRANCH_BODY'),
        prBodyForComment: (0, core_1.getInput)('PR_COMMENT_BODY'),
        prCloseMessage: (0, core_1.getInput)('PR_CLOSE_MESSAGE'),
        filterGitStatus: 'M',
        filterExtensions: ['md', 'markdown'],
        targetBranchPrefix: (0, core_1.getInput)('TARGET_BRANCH_PREFIX'),
        includeLabels: github_action_helper_1.Utils.getArrayInput('INCLUDE_LABELS'),
        targetEvents: constant_1.TARGET_EVENTS,
        notCreatePr: !github_action_helper_1.Utils.getBoolValue((0, core_1.getInput)('CREATE_PR')),
        checkOnlyDefaultBranch: github_action_helper_1.Utils.getBoolValue((0, core_1.getInput)('CHECK_ONLY_DEFAULT_BRANCH')),
    };
};
exports.getRunnerArguments = getRunnerArguments;
// eslint-disable-next-line no-magic-numbers
const homeExpanded = (path) => path.indexOf('~') === 0 ? (0, path_1.join)((0, os_1.homedir)(), path.substr(1)) : (0, path_1.resolve)(github_action_helper_1.Utils.getWorkspace(), path);
exports.homeExpanded = homeExpanded;
const cleanPath = (path) => (0, exports.homeExpanded)(path).replace(/\s/g, '\\ ');
exports.cleanPath = cleanPath;
// to avoid removing space
const getRawInput = (name) => String(process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`]);
const getArrayInput = (name) => github_action_helper_1.Utils.uniqueArray(getRawInput(name).split(/\r?\n/).filter(item => item));
exports.getArrayInput = getArrayInput;
