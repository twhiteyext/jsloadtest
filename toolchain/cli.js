import commandLineArgs from "command-line-args";

const VALID_MODES = {
    "development": true,
    "production": true
}

class CommandParseError extends Error {
    constructor(command, value) {
        super(`invalid option "${value}" provided to "${command}"`);
        this.name = "CliParseError"
    }
}

const parseMode = (mode) => {
    if (mode === "") {
        console.warn("No mode set. Bundling for development.");
        mode = "development";
    }
    if (!(mode in VALID_MODES)) {
        throw new CommandParseError("mode", mode)
    }

    return mode;
}

export const getCommandLineArgs = () => {
    return commandLineArgs(
        [
            { name: 'mode', alias: 'v', type: parseMode },
        ]
    );
}