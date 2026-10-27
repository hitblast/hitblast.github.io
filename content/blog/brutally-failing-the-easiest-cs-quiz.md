+++
title = "brutally fumbling the easiest CS quiz"
date = 2026-10-26
description = "I kind of messed up the first CS quiz of the semester... Let's learn how!"
authors = ["hitblast"]

[taxonomies]
tags = ["experiences", "programming", "rant"]
+++

Before I start yapping about anything, I'd like to say, today was NOT a hectic day. I came to campus sometime _before_ 12, attended a CSE111 quiz on Java Arrays, and just went on with my day just moving around campus, meeting people, applying to the famous [Mongol-Tori](https://bracu-mongoltori.com) team for a spot in the Controls & Software category, and also finishing my MAT120 class by late afternoon, which was around, 4:30 PM.

> For some context, the CSE111 course in my university is on Java OOP, or "Object Oriented Programming".

So, while I was listening to the teacher in my maths class, I realized something which I was supposed to realize much earlier, but better late than never - I kind of messed up the quiz, and the reality was so bad that I was being ashamed of myself in the middle of the class xD kind of an overreaction since the damage had already been done.

Let's get to what I actually did wrong, then.

The question was like this:

> "Given an array, modify the array in a manner that each of its elements correspond to the summation of all the other elements."

So, let's say we have an array `{5, 2, 3}`. In this case, the modified array following the rules of the question would look like: `{5, 8, 7}`. This is a pretty standard, and easy, introductory question at first glance. You just loop over each element and sum-up the other elements, right? It'd look something like:

```java
for (int i = 0; i < arr.length; i++) {
    int x = 0;

    for (int j = 0; j < arr.length; j++) {
        if (j == i) continue;
        x += arr[j];
    }

    arr[i] = x;
    System.out.println("Index " + i + ": " + arr[i]);
}
```

_Except, this was not the full picture._

Even after doing Rust for a while now, I kinda forgot mid-exam how the array _mutates in real-time_. Very dumb of me glazing a concept which is supposed to be easy, but now that I've managed to ruin it, let's go through this anyhow:

Picture this. For the first iteration (assuming our array is `{5, 2, 3}` as mentioned before), index 0 is skipped since `j == i` is true, and the sum of the other elements is **2 + 3 = 5**. So, our new 5 (the sum) replaces `arr[i]` (in this case, our old 5) in-place.

```java
// the current array
{5, 2, 3}
```

In the second iteration, it also works _out of sheer luck_ (since our first iteration did not really change anything about the array). The element at index 1 is skipped and the sum of the other two elements becomes **5 + 3 = 8**, and gets placed inside `arr[i]` again. So, the array gets modified like this:

```java
// the now-modified array
{5, 8, 3}
```

However, finally, in the _third_ iteration, things become apparent as now we don't have a record of our original array anymore! In the original array, the last item would have been 3 as usual and the summation would've been 5 + 2 = 7. But since our array is now _changed_, the actual summation of the other elements becomes **5 + 8 = 13** which is the **wrong ANSWER!**

```java
// Expected:
{5, 8, 7}

// Original:
{5, 8, 13}
```

<br>

Regardless, this was no CS-lesson. I just wanted to rant about myself a bit. I don't really know _how_ this happened, but maybe it had to do something with me getting too excited for hearing back from Mongol-Tori after submitting the form.

Thanks for tuning into my blog - long time no see, hopefully I'll see you in the next entry! :3

