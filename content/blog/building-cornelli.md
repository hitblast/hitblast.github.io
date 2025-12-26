+++
title = "Talking to my future self; creating \"cornelli\""
date = 2025-12-26
description = "How my friend and I competed on a project idea and ended up creating some Christmas-themed goodness, and how it worked out."
authors = ["hitblast"]

[taxonomies]
tags = ["experiences"]
+++

Yesterday was Christmas, so I had a lot of free time (even though technically I shouldn't since I'm literally studying for entrance), and one of my friends <[@Itsmemonzu](https://github.com/Itsmemonzu)> hopped into the podium VC of our Discord server. I was already camping there since I was pretty much being lazy and fixing some bugs of [cutler](https://github.com/machlit/cutler). He eventually ended up helping me find some issues and discussing about life in general.

Later on, he became bored. Meanwhile, he was asking if [Zed](https://zed.dev) would work on his Windows machine - I said it would, and he eventually ended up downloading and enjoying that piece of software. I believe he's still using it now. Regardless, since he was unscrambling some of his mental wellbeing thoughts and we *had* to solve the burnout issue, we decided to search for some project ideas for him to build.

Eventually another friend of ours came and he suggested that he builds a *time capsule.* The idea is simple - you put some text and leave it as-is for your future self to read. I thought he would build it, and turns out he even went as far as compiling a whole skeleton of the UI using [Windows Forms](https://learn.microsoft.com/en-us/dotnet/desktop/winforms/overview/), but then after dealing with all the complexity of C# and me *failing* to motivate him to stick with it, he decided to build it using Python.

Then he suggested - why not build the same project together, but with *different stacks?*

---

So, it was a competition if you haven't figured it out already.

He'd be building a time capsule of thoughts in Python, and I'd go around building it in a framework/language of my choice. Since I was already kind of hands-free with Rust after building several CLIs, I decided to unleash this cannon to kill an ant (literally).

We started early in the afteroon, but well as it turns out, we both had our works for the time so we were slightly distracted. Hours were in front of us to build a time capsule so flawless even the judges would get jumpscared by it. We decided we'd be calling in <[@furtidev](https://github.com/furtidev)> and <[@wolverton](https://github.com/wolverton120)>. They eventually agreed too.

#### kicker experience

We eventually started off writing the codebase instead of wasting much time. I'll shortly explain both of our stacks:

| Him | Me |
|-----|----|
| (cli) The [Rich](https://github.com/textualize/rich) framework for Python. Great for CLIs and the UX. | [clap](https://github.com/clap-rs/clap) since I will *not* be making the CLI interactive. |
| (language) Python 3.13 | Rust 1.92.0 |
| (packaging) None | cargo and gh-actions |
| (extra libs) Some Windows-specific APIs for Python (C bindings which I forgot) | tokio, serde and anyhow |

It was clear that both of us will be using the most convenient tools we had at our disposal, so the contest was going to be fun.
