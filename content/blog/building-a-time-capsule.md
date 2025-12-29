+++
title = "Christmas Eve and a battle to create a time capsule"
date = 2025-12-30
description = "How a friend and I hopped in on a challenge to create two tiny programs as our future mailboxes, and how they turned out."
authors = ["hitblast"]

[taxonomies]
tags = ["experiences", "projects"]
+++

### pre-context
 During the afternoon of 25th December, I was just casually hopping around Discord in search of what to do. I randomly joined a voice channel on my Minecraft team's server, and one of my friends also (luckily) hopped in. <[@Itsmemonzu](https://github.com/Itsmemonzu)>, turns out, was also looking for something to do; and a second friend joined to aid him with his idea shortage.

Previously, his urge led him to install [Zed](https://zed.dev) on his beefy machine (after I told him about how it uses layers of GPU optimization in the process of rendering his code), and somehow all of a sudden he wanted to do all-things Zed. The second friend, in the meantime, suggested him that he makes a *time capsule program*. I'll return to this in a bit.

Now as a matter of fact, the size-to-functionality ratio of his previous application was pretty unrealistic - say, 64 megabytes for doing a GET request to the [Minecraft Server Status API](https://mcsrvstat.us/), and my futile attempts to motivate him back to use C# for his desktop apps were all turning to vain. He eventually turned to *Python* for this one.

Then suddenly he asked - how about we do a programming challenge over this?

Hmm, not a bad idea!

I haven't had a programming battle with someone ever since the prehistoric days of HackSquad 2022, so doing this was going to be fun, and Monzu's new-learning nature was also going to be interesting to analyze within the challenge. We eventually agreed on a few things:

- Different stacks. Obviously. He'd be using **Python** while I'll do the same program in **Rust**.
- We'd both be using a shared algorithm for determining (but this has some lore to it, so be alert while reading).
- We'd have to finish it within the Christmas Eve - a fully working copy of our projects, that is.

I'll be attaching more context along the way with this entry.

Till then, the game was officially on for both of us!

### intermediate planning

We were connected to the same Podium VC we initialized with for the entirety of the challenge, and while VC-ing, we both discussed some common frameworks for our program:

| His stack | My stack |
|-----------|----------|
| Good old Python as usual. | Rust for me. |
| The [Rich](https://github.com/Textualize/rich) frameworks. Great for TUI/UX. He wanted his CLI to be fully interactive. | [clap](https://github.com/clap-rs/clap) for me since I didn't want my iteration to be interactive at all for saving some time. |
| [TinyDB](https://tinydb.readthedocs.io/en/latest/index.html) as the database, since he was already fluent enough working with JSON tokens. | I wanted to build my own database for the work, hence I created [ChristmasDB](#) |

Now let's discuss the initial concept of a *time capsule*. As our friend Rem had described it:

> "A program that saves a text and keeps it away, and finally returns it after a certain time."

Here's a bit of my thinking process:

My first thoughts after seeing his idea was - bootstrapping such a simple concept into a CLI and not making others bored would be a difficult task. I had to think of something which Monzu wasn't planning about. I'd have to ensure two things:

- Make the code *insanely* simple to use. That'd consume more of "my" time, but it'd ensure that the entire thing works on all the three major desktop platforms I'd be targeting.
- I'd have to wrap everything in just the `ChristmasDB` layer so that commands are only hardcoded iterations of the stuff I want to do.

And, based on what I heard from Monzu:

- He wanted to use the least amount of commands so that his CLI was fully usable by just the press of a few keys (except for typing the actual text).
- He also wanted to take advantage of Python's dynamically-typed ecosystem to reduce code as much as possible.

And, based off of the sentence Rem told us (the other friend, if I haven't shared it with you already), we'd have to create a way to actually "put the text away from the user", so that it is not accessible before the time the user allocates, so we'd need a way to **encrypt the text** and make it undetectable without some sort of deciphering mechanism.

### ignition!

We started discussing about our common stuff at first. He (and eventually I too) decided to call each input of the user a "capsule", which has the following fields attached to it:

1. The actual text, but ciphered.
2. The datetime indicating the exact moment the text was ciphered away.
3. The lifetime of the text. Things can't be permanent, just as in life.

He first thought of running a background job to provide real-time insight of the datetime to the program, but I had a simpler solution in mind, so seeing him mess up his core insight about how the program would work, we decided to share our algorithm. It was pretty simple:

1. The program would *only* work when executed - not in the background, so that's one axed thing.
2. Since we're already tracking two time-tracing fields (2 and 3 above), it'd be very easy to calculate the approximate time of "unlock" for the capsule.
3. If the user wanted to check whether a capsule was unlockable, it'd just check a condition: `if (future_time < present_time) {... # do unlock stuff}`

#### the route monzu took (algo)

After all of the yapping about the initial brainstorm phase, we were finally ready to start working. While I was entirely focused on the `ChristmasDB` layer, Monzu was honestly making some pretty good strides. He started off by creating his input layer which was composed of numbers, and occasionally, some text. Primitive in nature, but works.

He was also streaming for me to help with some of his stuff so I had a sneak peek at his input strategy:

```
Create a capsule (1)
Check for unlockable capsules (2)
Unlock capsule (3); Your choice (1/2/3/exit):
```

Turns out he was going all-bland on the CLI, leaving the opportunity to simplify things a little. I didn't know whether this was going to change for the lifetime of the challenge, but we'd see shortly.

I also asked him regarding his backend logic and whatnot. He was busy handling `timedelta` and `datetime` objects with his TinyDB instance. Inspecting some of his "last" code that was uploaded to GitHub, I can see some remnants which I'm bound to explain in this blog:

```python
# P.S.: My indentation got wrecked copy-pasting this snippet.

    elif action == "3":
        print("[white][bold]Which capsule do you want to unlock?[/][/]")
        num = int(input(":")) - 1
        # Check current time
        now_time = datetime.now().timestamp()

        # Accessing JSON Data
        parse = database.all()
        unlock_time = float(parse[num]["time_limit"])
```
[(online snippet's here)](https://github.com/Itsmemonzu/Shomoy/blob/fa69132a001c2d3f3b2c7371c847c562a01bc725/main.py#L91C8-L99C58)

I'll provide some entirely personal comments from here onwards (and some sweet, sweet lore).

Going into the snippet, I can do nothing about getting flabbergasted by the inconventional naming conventions (even though the code's working perfectly). The unreliable parsing from `parse[num]["time_limit"]` might also seem a little vague at first, since there isn't a strict schema being enforced due to Python's core json implementation being dynamic in nature.

As a matter of fact, during the primary (and late-game) stages, Monzu himself ended up parsing the `time_limit` field as integers rather than `datetime` instances, and even when he did end up parsing correctly, he passed `datetime` objects directly into the schema for reflecting back. *\*confused Monzu noises in the background wondering why it ain't behaving like Rust\**

As of the shared algorithm we were talking about implementing, his way of implementation was, again, using the `time_limit` field. The snippet is this:

```python
def checkCapsule():
    # Check current time
    now_time = datetime.now().timestamp()

    # Accessing JSON Data
    parse = database.all()

    # Check the dictionary for possible unlockable capsules using a loop
    for i, unlock in enumerate(parse, start=0):
        unlock_time = float(parse[i]["time_limit"])
        if now_time >= unlock_time:
            print("[green][bold]You can now unlock your Capsule No." + f" {i + 1}")
        if now_time < unlock_time:
            print(
                "[red][bold]Your capsule No.[/][/]"
                + f" {i + 1} [red][bold]is not unlockable yet.[/][/]"
            )
```
[(online snippet's here)](https://github.com/Itsmemonzu/Shomoy/blob/fa69132a001c2d3f3b2c7371c847c562a01bc725/main.py#L27-L43)

For some weird reason, he ended up implementing the same algorithm twice in two different places. I mean, okay, that's what *functions* exists for. But, have a look yourself:

```python
    elif action == "2":
        checkCapsule()  # implements check
        time.sleep(5)
    elif action == "3":
        print("[white][bold]Which capsule do you want to unlock?[/][/]")
        num = int(input(":")) - 1  # de-facto imputs.

        now_time = datetime.now().timestamp()

        parse = database.all()
        unlock_time = float(parse[num]["time_limit"])  # recall here
        if now_time >= unlock_time:  # also recall here
```
[(online snippet's here)](https://github.com/Itsmemonzu/Shomoy/blob/fa69132a001c2d3f3b2c7371c847c562a01bc725/main.py#L88-L100)

I hope you clearly see the minor details I've pointed out in front. The code works nicely, no comments regarding that. It'd break with one algorithmic change, however (saying just for the name of explanation).

#### the route I took (algo + monzu's entry)

Now, not to brag or anything about code - in fact I actually write pretty shit Rust, and considering the fact that other, more knowledgable people use the stack with lifetime specifiers, generics and whatnot for simple data parsing like this, I truly am new to this. However, I took a different approach to the same problem he took upon.

He still hadn't handled the encryption layer, but I picked good old `AES` as the encryption method. I was also learning about its implementation at the same time since I had never implemented it to date on a CLI project. Within the `ChristmasDB` layer, I implemented a few functions which did the following:

- One function for comparing `now_time` and `future_time`.
- One for generating a new `ChristmasDB` instance with a user-defined `password`. This would generate a `[0u8; 32]` key unique to the particular password.
- One function for generating a new capsule from a given text. This one did the following in order:
  1. Prepare the cipher. This includes generating a new `iv` for each text powered by `OsRng`, which'd later be used to create a cipher by attaching with the `key` created beforehand.
  2. Applying a keystream to the text so that it gets ciphered.
  3. Store it within a `capsules` variable within the store.
- One for autosaving the database, since I'm too lazy to setup manual CRUD operations along the way.
- One for decrypting a `Capsule` object (yes, I used structs for capsules too).
- And finally, one to remove a capsule instance from the store.

The code is too long for me to include here, so I'll just include the primary algorithms here. Rest will be linked.

For checking whether a `Capsule` should be deciphered, I use this:

```rust
// yes I used serde for the whole store
// that too in JSON
#[derive(Deserialize, Serialize, Clone, PartialEq)]
pub struct Capsule {
    data: Vec<u8>,
    nonce: [u8; 16],
    should_be_kept_for: Duration,
    time_added: NaiveDateTime,
}

impl Capsule {
    pub fn is_awaiting_decryption(&self) -> Result<bool> {
        // This uses NaiveDateTime from the `chrono` crate.
        if let Some(future) = self.time_added.checked_add_signed(self.should_be_kept_for) {
            Ok(future < Local::now().naive_local())
        } else {
            bail!("Duration overflow when computing unlock time.")
        }
    }
}
```

I will also include the `decrypt` function for you to have a sneak peek:

```rust
    pub fn decrypt(&self, cap: &Capsule) -> Result<(String, usize)> {
        let mut data = cap.data.clone();

        // AES 256 in CTR mode; this is just a type-override from the `ctr` crate.
        let mut cipher = Aes256Ctr::new(&self.key.into(), &cap.nonce.into());
        // Apparently applying keystreams twice reverses the encryption.
        cipher.apply_keystream(&mut data);

        // Improper parsing handled since keystreams can be improperly applied,
        // given that the user has provided a wrong password.
        let text = String::from_utf8(data).context("Invalid UTF-8, possibly a faulty password?")?;

        let idx = self
            .capsules
            .iter()
            .position(|x| x == cap)
            .context("Capsule not found! Did you delete it manually? :suspicious_eyes:")?;

        Ok((text, idx))
    }
```

[(get the full ChristmasDB snippet here)](https://github.com/hitblast/cornelli/blob/master/src/core/database.rs)

I had a lot of fun making this work.

Returning to the original lore, I also implemented `CORNELLI_PASS` as an environment variable through which the user would apply to set a password. I looked at Monzu's iteration, and I couldn't find a password. Seems like he stole the password side of things from the user and entirely put it on the hands of his own program; which is, I don't know whether to call clever, but the solution kind of works, but then again it becomes pointless.

Oh and, I'd only create *two* commands:

- `keep "anytext" <duration>`: *Keeps* a capsule and keeps it away till the set duration.
- `mailbox`: Gives you a surprise Stardew Valley-style view at the messages you're meant to see at the moment, probably left by your past self.

### two interfaces

I was kind of envious of his interface, that he managed to at least get a primitive solution up and running that fast. I was being very lazy to pass a mutable string variable to an `io::stdin()` call, so much so that I had to compensate with even harder `clap` arguments.

Though, I had previously created [rust-cli-template](https://github.com/hitblast/rust-cli-template) for my personal projects, so that came in handy. I had just cloned and deleted the `.git` folder to gain a headstart. This was *before* all of the algorithmic lore described above. By now, Monzu was getting into the encryption part of things, and I was just starting off with the UX.

I implemented the storymode-like interface for `mailbox`. Also, something different also started happening while I was doing that.

By the time they had joined, it was almost 6 hours that Monzu and I were talking in the channel for, and they found us in completely different states. I had spend a ludicrous amount of time optimizing the database, so I was pretty much clear for UX. I had also yoinked the duration-parsing (`1h2m1s`-style) from [trimsec](https://github.com/hitblast/trimsec) to get some boost. On the other hand, Monzu was only just getting into duration parsing. Frantically enough, he started seeking help from both furti and wolverton.

Aren't they supposed to be judges?

Anyways, he also had asked me about duration-parsing before. At first I thought only doing it by the day would be cheap enough for the project, but upon looking at the actual problem, neither programs would've been able to track the correct decryption time if we had done that, so I skipped over the simplification idea. Turns out, Monzu didn't get the clarification and he had implemented a days-only parser.

I was seeing an unreasonable amount of panic within - I bet he could've *hardened his runtime for comfort* (no pun intended).

He ended up adding a positional parsing method for the duration (`x hours, x minutes, x seconds`, non-comma-separated). Having a look at his source, we can see exactly that alongside his self-password mechanism:

```python
          # Parse key from key.txt
           with open(keyFile, "rb") as keyFile:
               readKey = keyFile.read()
               f = Fernet(readKey)
           message = f.encrypt(input().encode())
           user_input = input("Set time limit: (i.e 2 50 30 (day/hour/minute)) ")
           days, hours, minutes = map(int, user_input.split())
           time_limit = datetime.now() + timedelta(
               days=days, hours=hours, minutes=minutes
           )
           if isinstance(time_limit, datetime):
               database.insert(
                   {
                       "message": str(message),
                       "time_limit": time_limit.timestamp(),
                       "current_time": str(datetime.now()),
                   }
               )
               print("[red][bold]Your message has been capsulized!")
```
[(original snippet's here)](https://github.com/Itsmemonzu/Shomoy/blob/fa69132a001c2d3f3b2c7371c847c562a01bc725/main.py#L66C12-L85C1)

### release timer

Seeing Monzu's unreasonable panic, furti gave him an additional 10 minutes (which ended up scaling to 30 minutes since Monzu was ignoring that). We also saw some late-game failures in his code. Remember the `datetime` and `timedelta` objects we were talking about? Turns out he was parsing them wrong again, and this time he was fully yelling in the voice channel.

This isn't supposed to be a Monzu-rant blog entry, but he quite literally realized that `datetime` and `timedelta` were distinct data types and not derivations of language primitives. Quite fun.

We had another bit of coding leftover. Monzu was closing in on the finish line, and I was already finished, looking for further polishing ideas. I even tried downloading the [Stardew Valley Overture](https://open.spotify.com/track/2q2Z2A0Mt8AsWyQEdB6wuu) soundtrack just for the demo for presenting the `mailbox` command, but ultimately that didn't turn out well, so I scrapped the idea.

Once Monzu was finished, we were counting down for the CI builds. He was pretty much off with the Python interpreter and the `pyinstaller` library for packaging. My builds actually failed once since I had kept the old bin names from where I had gotten the workflows (one of my previous projects), so I had to restart it with freshly. After that, we both submitted.

## the release

At this point of writing the blog entry, I'm pretty burnt out from the 3AM fatigue, but to summarize, the release was a lot more entertaining.

I released the repository with the name "cornelli", and Monzu released his by the name "Shomoy", which means time in Bengali.

Both furti and wolverton were checking out our repositories. My project was first tried out by wolverton, which he cleared without hesitation (and also gave me a nice rating, thanks wolverton if you're reading this). While reading the documentation, he had also asked for some alignment with the setup procedure, since I didn't include the particular setup procedure for PowerShell/`cmd`, and setting `CORNELLI_PASS` failed inside that particular Windows environment. I'm pretty glad I could fix that by just changing `export` to `set` inside the command.

As of Monzu, his road was a little bit rocky. The primary issue being him not including a sort of "dependency lockfile" in his project, ultimately leading to furti and wolverton running the following command to install the three dependencies:

```bash
$ pip install rich cryptography tinydb
```

After some iterations, wolverton (watching my stream) and I managed to get his application running.

I won't take the courtesy of the overall review. That goes to the judges.

Wolverton had left a massive review for both of the projects. He rated in four categories: documentation, installation, the actual program and overall. On the contrary, furti left a huge almost-40-minute review on both of the projects, which is private so I won't be sharing it here.

### verdict by judges

Even though the overall result was biasing towards different things, both Monzu and I faced criticism and questions for our design choices. For example, the `CORNELLI_PASS` pattern I was using got questioned by furti since in the v1 release, it wasn't behaving well at all for some mailbox entries. We ended up fixing it later on.

On the flip side, Monzu faced criticism for the following things:

- Providing no lockfile.
- Providing zero documentation (he actually erased his `README.md` while force-pushing without prior knowledge).
- Changing the codebase at the time of the review and telling judges to download the latest source.
- Having several dependencies.

### verdict, overall

And with that, we got ourselves two new projects.

- [cornelli](https://github.com/hitblast/cornelli): Write to your future self.
- [Shomoy](https://github.com/Itsmemonzu/Shomoy): A time capsule for your terminal.

I'm very thankful that I had agreed to do this challenge, as this was close to a teeny-tiny hackathon for both of us. Hmm, maybe I could continue this with my friends?

Till then, thanks for reading this entry <3 signing off.
