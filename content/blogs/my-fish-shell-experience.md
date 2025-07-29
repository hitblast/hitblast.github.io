+++
title = "My fish shell experience, and why I might not need it"
date = 2025-05-25
description = "My experience with setting up fish from the ground-up, annotating the differences and whether fish can (or not) be a good choice for you."
authors = ["hitblast"]

[taxonomies]
tags = ["command-line", "experiences", "fish-shell", "tips"]
+++

### The title seems misleading, right?

Well, fish is indeed a good shell (I'm not foreshadowing at all, totally... maybe?) for those who prefer scripting in a simple language, and some modern features like on-the-fly autocompletion and more. And, at the time of writing
this entry, I'm still using fish on my Mac.

I've been an avid bash user for over 5 years now, and
although I switched to zsh during my first transitional period into macOS, the urge to write automated
scripts for solving other tasks and doing mundane tasks really brought me back to bash.

However, as many people jump in to oxidize their toolchain and generally every set of software they use,
I decided to give some oxidized tools a try as well (by "oxidized" I'm referring to apps/tools written in Rust). And, the trend isn't really new!
I've been using Rust-based tools for quite a while, including:

- [zoxide](https://github.com/ajeetdsouza/zoxide) - a replacement for `cd`
- [eza](https://github.com/eza-community/eza) - a replacement for `ls`
- [mise](https://github.com/jdx/mise) - my personal favorite; a replacement for `asdf` for managing toolchains
... and many others

And in the process of using them, I have actually created some of my own, simple tools:

- [cutler](https://github.com/hitblast/cutler) for automating my macOS setup, acting as a replacement for manual scripting
- [hookman](https://github.com/hitblast/hookman) for writing git hooks with TOML files

Rust is really an awesome language for the developers of the 21st century in my opinion. It's safer, faster than most
languages and the compiler really helps out at even the silliest of optimization mismatches.

However... does it deliver in the terminal?

### For most tools, I'd say... yes!

Rust's speed along with its concurrency features, if coupled with `tokio` for async, or `rayon` for multithreading, can
lead to major performance bumps which can also be seen in literal desktop apps too! The edge CLIs deliver over desktop apps is
that, it's just a lot more fun (and significantly faster) in terms of I/O and general throughput if you're a terminal
fanboy.

So, after judging all of this, I decided to give a Rust-based shell a try.

### Installing fish

I installed the shell with this command:
```bash
brew install fish

# add to shell entries and init
sudo sh -c 'echo /opt/homebrew/bin/fish >> /etc/shells'
chsh -s /opt/homebrew/bin/fish
```

Now my first impressions with the shell was, **"How in the world is it fetching completion data without me even needing
to put a config file?"**

I honestly got surprised with the out-of-the-box experience of fish. It automatically sets up autocompletion. Though,
I ran into a few difficulties at first:

- My **typing speed** wasn't really syncing with the completions (a crucial detail we'll get back to later on).
-  I still needed to setup vim keybindings with fish later on since I'm used to having `h j k l` for moving around.
- All of the commands showed up perfectly during auto-suggestions, *but they didn't work.*

### Solving the configuration crisis

So, after running into the difficulties, I had to figure out how to configure fish on my laptop. I have a dotfiles
repository which [you can find here](https://github.com/hitblast/dotfiles), or in the homepage of this website. I use this
repository to keep all of my desktop configuration in place.

According to the documentation, the config file should reside in the following directory:

`$HOME/.config/fish/config.fish`

I had to go to the dotfiles directory manually and create the file after undoing my symlinks to the home directory:

```bash
cd dot  # zoxide coming into play

stow -D . -t ~
mkdir -p .config/fish/config.fish && touch .config/fish/config.fish

# redoing the symlinks
stow . -t ~
```

Now, the first difficulty I ran into here was that, I actually didn't think fish would initialize the config file itself,
so creating the file manually with my editor threw an error. So, I had to run stow with the `--adopt` flag in order to fetch
the generated config:

```bash
stow . -t ~ --adopt
```

I have a handy LLM setup going on my primary editor, [Zed](https://zed.dev/), which I sometimes use to write shell scripts
and automate the process of writing repeated data. So, I figured, why not just pull up a model to solve the configuration
crisis?

I had two files to essentially migrate:

- ([Reference](https://github.com/hitblast/dotfiles/blob/102b6ed9d42dfbad4ecf379a0110bf8f386e505a/.bash_profile.old)) The `.bash_profile` file for variable initializations and `PATH` mods, and
- ([Reference](https://github.com/hitblast/dotfiles/blob/102b6ed9d42dfbad4ecf379a0110bf8f386e505a/.bashrc.old)) The `.bashrc` file for program initializations

Essentially, the `config.fish` can do both at the same time, so I needed to merge them. I quickly told my model to
present me a migrated example, and it sent me this:

```fish
# ~/.config/fish/config.fish

# ————————————————————————————————
# 1) Environment variables
# ————————————————————————————————

# TERM
set -x TERM xterm-256color

# Load Homebrew environment (PATH, PKG_CONFIG_PATH, etc.)
eval (brew shellenv)

# Add any local bin directory
set -x PATH $HOME/.local/bin $PATH

# ————————————————————————————————
# 2) Aliases & functions
# ————————————————————————————————

# Aliases in Fish are really just functions
function cat;    bat $argv; end
function ls;     eza --icons=never -l $argv; end
function lz;     lazygit $argv; end
function lzy;    lazygit $argv; end
# ... other aliases

# Convert your bundleid() helper:
function bundleid
    osascript -e "id of app \"$argv[1]\""
end

# ————————————————————————————————
# 3) Third‐party tools initialization
# ————————————————————————————————

# cutler (macOS preferences)
eval (cutler status --prompt)

# mise
eval (/opt/homebrew/bin/mise activate fish)

# fzf: load key bindings & completion
# Adjust path if yours is elsewhere
source /opt/homebrew/opt/fzf/shell/key-bindings.fish
source /opt/homebrew/opt/fzf/shell/completion.fish

# starship prompt
eval (starship init fish)

# zoxide
eval (zoxide init fish)

# any other per‐shell init can go here
```

Already, I could see a few conflicts from my own eyes:

- fish isn't really a POSIX-compliant shell, meaning that syntactical differences are common. But here, I was seeing way too many "similarities".
- fish mostly doesn't really need completion setup, and I had to have a look at what it was initializing for `fzf` and other programs.

Nonetheless, I copied the config the AI had generated and pasted it in `config.fish`, and oh boy there were errors.

The syntactical differences really came to play in this case. Statements like `eval` aren't really necessary when
it comes to using fish. I can do something like:

```fish
starship init fish | source
```
... to replace the following:
```bash
eval (starship init fish)
```

So, I got to work, and eventually after completing the migration of both files, I got an end result which looks like this
in my current dotfiles:

```fish
# ~/.config/fish/config.fish

# ————————————————————————————————
# 1) Environment variables
# ————————————————————————————————

# Disable greetings
set fish_greeting ""

# Editor
set -x EDITOR nvim
set -x VISUAL nvim

# Currently, Ghostty isn't that recognized of a terminal
# So, set to xterm-256color for support during ssh sessions
set -x TERM xterm-256color

# Disable Homebrew auto update
set -x HOMEBREW_NO_AUTO_UPDATE 1

# Load Homebrew environment (PATH, PKG_CONFIG_PATH, etc.)
/opt/homebrew/bin/brew shellenv | source

# Add any local bin directory
set -x PATH $HOME/.local/bin $PATH

# ————————————————————————————————
# 2) Aliases & functions
# ————————————————————————————————

function cat;    bat $argv; end
function ls;     eza --icons=never -l $argv; end
function lz;     lazygit $argv; end
function lzy;    lazygit $argv; end
function lazy;   lazygit $argv; end
function mactop; sudo mactop --color white $argv; end
function updateall
    brew update; and brew upgrade
    mise upgrade
    uv tool upgrade --all
end

function bundleid
    osascript -e "id of app \"$argv[1]\""
end

# ————————————————————————————————
# 3) Third‐party tools initialization
# ————————————————————————————————

# cutler
cutler status --prompt

# mise
mise activate fish | source

# starship prompt
starship init fish | source

# zoxide
zoxide init --cmd cd fish | source
```

This was after probably thirty minutes of debugging of the config file. I am pretty satisfied with how it turned, now moving on...

### Initializing keybinds

In my original `.bashrc` file, I did this to enable `h j k l` and other Vim keybindings:

```bash
set -o vi
```

It was pretty easy to set up. But, given that fish's community is comparatively smaller than that of bash's, I had to
Google around for quite a while until I found this:

```fish
# had to run this command
fish_vi_key_bindings
```

Running this command would essentially modify `~/.config/fish/fish_variables` to include the Vim keybindings option. And now I could
finally use it like I use bash!

### The lovely things about fish

I've noticed a couple of major pros:

- The Vim keybindings are more precise. In bash, I would struggle with doing edits to my commands in `NORMAL` mode. This doesn't happen on fish, and I can easily perform the required edits without messing up my texts.
- The default prompt is customizable in an intuitive way, so my need for [starship](https://starship.rs) was essentially gone (though I am still using it).
- **Plugins.** I'm yet to try these but I'm seeing positive reviews everywhere.

For the hipsters out there, fish can actually be an excellent choice for manipulating data within shell, and just using it for general shell commands can also be a delightful experience.

### And... the cons...

Okay so, remember how I mentioned my typing speed early on in this entry? Well..

Typing around 130-150wpm obsoletes the need for an autocompletion setup, assuming you have a muscle memory for typing
commands, which I essentially do. I use shell commands *everywhere*, from self-hosting services on cloud to
`ssh`-ing into other devices. And after years of typing commands, autocompletion is a feature which has essentially been
"wiped out" of my memory. Why need an autocomplete if your brain does it for you?

And, typing in such speeds only makes the command appear as flickers on your screen. This alone renders my use case for fish virtually "useless",
except when I really need to see some documentation for a command without typing `man <command>` or `brew help <command>`, though I prefer the latter more.

Also, since fish is not POSIX-compliant, I can't run shell scripts which derive from zsh or bash. It would also probably
result in me losing my muscle memory in bash over time, which would result in a major con for me since I write a lot of
CI/CD pipeline code for deploying my applications.

Finally, fish, for the most part, **is slower than bash**. This might come as a surprise, but bash uses C as its primary source
language and can often deliver the fastest, no-bloat terminal experience. However, since we spend most of our time inside
terminal applications and not shells, it should not be that big of a deal.

### Verdict

Depending on your personal scope of usage, fish can be a really great alternative to bash. I personally find bash "enough" for the things
I do - run code, do light data manipulation and just generally enjoy the terminal side of things. It may be different for
other people, but at the end of the day, it's your "personal preference" which makes you choose the perfect combination of
workflows to go with.
