+++
title = "Unlocking the bootloader of Xiaomi's HyperOS (v1)"
date = 2025-10-25
description = "How I unlocked one of the most notorious bootloaders in the phone industry with the right tooling, and how you can too."
authors = ["hitblast"]

[taxonomies]
tags = ["guide", "android"]
+++

## Lore (optional)

I always wanted a "degoogled", distraction-free phone for myself. In order to achieve that, we often need elevated access to our system which most phones do not provide nowadays. We also need to [unlock our bootloader](https://source.android.com/docs/core/architecture/bootloader/locking_unlocking). This is a general concept across all Android devices, and on iPhones this is phrased as "jailbreaking".

Currently, I use a [Xiaomi Redmi Note 11S](https://www.mi.com/global/product/redmi-note-11s/specs/) as my daily driver, and, to say the least, I always had bad experiences with unlocking Xiaomi phones previously. But, especially for this model, doing the same would be a whole new series of challenges, as Xiaomi's HyperOS ROM does not allow
unlocking the bootloader [without permissive access](https://xiaomitime.com/bootloader-unlocking-comes-to-an-end-with-xiaomi-hyperos-2-0-12926/) at all - that too being very strict (I heard somewhere that they only grant
1-2 devices due to the sheer demand).

Thankfully, I have just the right tooling this time!

This guide is based on my personal experience on how I managed to unlock the bootloader of my phone using the right tooling, and honestly, it isn't much technically dense for a beginner to not follow through either!

> Please do know that the actions here won't be covered by your warranty, so if you're using a new phone, make sure that you REALLY wanna do this and not force yourself into it. A bricked phone is the least of your wants.

## Prerequisites

Some initial tooling is required all of the things to work:

- [android-platform-tools](https://dev.to/james_robert/quick-guide-to-installing-android-sdk-platform-tools-on-macos-and-windows-266c) for using USB debugging with the phone.
- [git](https://git-scm.com) to do some cloning.

Later dependencies are scattered along the guide. Just follow through it and you'll be good.

Since I'm on a Mac, I'll use these commands to download the first two deps:

```bash
# If you don't have Homebrew install, uncomment and run this command:
# /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# dep #1
$ brew install android-platform-tools

# dep #2
$ brew install git
```

## #1: Enable USB debugging + OEM unlocking

Follow these steps in order:

1. Go to the **Settings** app > **"About Phone"**.
2. **Press on** the HyperOS logo / specs option.
3. Keep tapping on **OS Version (not Android version)** until you see this message: "You are now a developer!"
4. Come back to the Settings homepage and scroll down, then press on **"Advanced features"**.
5. Go to **Developer options** and toggle the **"USB Debugging"** option. This may show a warning, but accept it anyway.
6. Also toggle **"OEM Unlocking"**, this will come in handy later.

## #2: Exploit unlock request

This is essential if you don't want to fall into the trap of unlock delays imposed by Xiaomi themselves (where is "right to own" heading nowadays?).

### How it works

We'll use [HyperSploit](https://github.com/TheAirBlow/HyperSploit) for this job. It works like this:

1. When we attach a Mi Account with our devices, it essentially sends a payload to Xiaomi's servers, which includes but is not limited to:
    - The OS (in this case, HyperOS version).
    - The time the user is applying at; I think the servers use it to kind of wreck the whole purpose of unlock requests since Xiaomi uses Beijing time.
2. The tool replaces the request with a custom one, telling the servers that the device in question is running **MIUI 10** instead of HyperOS.
3. It also replaces the **Settings app** with a custom version which supports easy manipulation when pressing on the "Add Account to Device" button.
4. Thus, the server grants the unlock request.

### Steps

1. **Download the tool** from the [GitHub Releases](https://github.com/TheAirBlow/HyperSploit/releases) section. I had downloaded the `HyperSploit-MacOS` binary since I am on macOS.
2. **Plug your device with a USB cable.** You could also use Wireless Debugging if you're familiar with it but since I've already preferred USB Debugging above, I think it's best to stick with it for this guide.
3. **Grant execution permissions:**

    ```bash
    $ cd Downloads && chmod +x ./HyperSploit-MacOS

    # remove quarantine since macOS blocks the execution of
    # third party softwares most of the time
    $ xattr -d com.apple.quarantine HyperSploit-MacOS
    ```
4. Run the program: `$ ./HyperSploit-MacOS`

If no errors happen and you see a confirmation in your terminal, you can plug your device out; it's ready for unlocking.

## #3: The final step

Like I said before, this is the only step which we will need a Windows machine for, so before continuing, switch to a different machine or spin up a VM (not recommended since there are some custom drivers involved).

1. Power off your phone.
2. Press and hold `Volume DOWN` + `Power` to enter **Fastboot Mode**.
3. Plug in your phone with the Windows machine and leave it as-is.
4. Download the official [Mi Unlock Tool](https://miuirom.xiaomi.com/rom/u1106245679/7.6.727.43/miflash_unlock_en_7.6.727.43.zip) with this link. Once done, extract it and run `miflash_unlock.exe`.
5. Log into the same Mi Account you've added/attached to your device in the previous step.
6. Just follow through the on-screen instructions.
7. Once unlocked, your phone will undergo a complete factory reset.

## Conclusion

I hope after following this guide, you'll have a phone which isn't unlocked behind strict nonsensical restrictions anymore. Do keep in mind that your data might be easier to access now, so whatever you do with your device, make sure to keep that in check.

I might work on a separate guide on how to root Android phones with this same setup. But till then, stay tuned. :3
