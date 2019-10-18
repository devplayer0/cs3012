Linus Torvalds - A Key Software Engineer
========================================

*As the original author of the Linux kernel, Linus Torvalds has had an
incredibly profound impact on the software industry.*

Early life
----------
Torvalds was born December 28, 1969 in Finland to a Swedish-speaking
family. Understandably, he attended a Swedish-language school and found
only subjects like Maths and Physics to hold his interest - "phys ed" was
not his strong point.

His first computer was a Commodore VIC-20, predecessor to the widely
successful Commodore 64. Linus' grandfather, a professor of statistics,
purchased the machine as a toy and also for use in his calculations.
Törnqvist hoped his grandson might become in his maths, so
he often had Linus help him enter BASIC programs into the VIC-20.
Soon, Linus would gain a significant in entering programs of his own
creation.

Eventually, he outgrew the Commodore machine. Linus saved up for a
Sinclair QL, which featured a cost-reduced Motorola 68000 (``m68k``) -
the main compromise being an 8-bit bus, despite being one of the first
widely available 32-bit processors. His interest in operating systems
and low-level systems programming started an early stage. When
purchasing a floppy drive to replace the Sinclair-exclusive looping tape
drive, he decided that the provided driver was so poorly written that he
should create his own. Linus would go on to develop his own text editor
and assembler, proudly proclaiming their superiority to the
Sinclair-provided ones.

The beginnings of Linux
-----------------------
Before starting at the University of Helsinki, Linus purchased
Andrew Tanenbaum's *Operating Systems: Design and Implementation* and
became enamoured with the philosophy of Unix. He desperately wanted to
work on his own operating system, but the book's educational Unix-like
system, MINIX, required a 386 processor, so Linus had to save for a new
machine.

Once he got his IBM PC clone, complete with 4 megabytes of RAM, Linus set
about creating a terminal emulation program so he could dial the university
modem and read the news. In order to learn about the low-level capabilities
of the 386, he opted to write the program from scratch, even without any
operating system. Once a multitasking program was working and displaying
text on the screen, he understood the basics of his new machine. After
getting his program to talk to the modem, Linus would regularly use it to
connect to the university's computer and read email or the MINIX groups.

The limitations of a bare-metal terminal emulator were becoming readily
apparent, however. Torvalds wanted to upload and download files, but that
meant reading and writing to disk, and not just raw data but files. This
required a disk driver, file system driver and more. After mustering the
strength to complete these tasks, Linus realised that his terminal
emulator had become much more than just that (even referring to it as his
"GNU emacs of terminal emulation programs").

He decided that he might as well turn his project into a proper operating
system. Unable to obtain the POSIX standards (which define the important
system calls for Unix-like operating systems), Linus started implementing
his system based on the manuals for the Sun variant of Unix running on his
university server. The manuals didn't tell him how to implement the system
calls needed for the kernel to run programs (system calls allow running
programs to ask the operating system for access to some resource, such as
a file on disk), but merely how they should function.

Noticing his request for the POSIX standards in the MINIX group, a
teaching assistant at the Helsinki University of Technology offered him a
subdirectory on an FTP server to make Torvalds' operating system available
for download once completed. According to Linus, this is where the name
"Linux" came from - originally he came up with "Freax" (a combination of
"freaks", referring to the members of the MINIX group who were interested
in operating systems development and "Unix", since his system was a Unix
clone). When Ari Lemke, the TA from Helsinki University of Technology
called Linus' subdirectory on the FTP server "Linux", the name stuck.

After some painstaking months spent doing little else besides programming,
he announced his operating system to the newsgroup to the interest of the
members (some even offering to be beta testers). Although he believed not
many tried the first "release" of Linux to the FTP server, it was worth
uploading since it proved that he had actually followed through with his
plan to create an operating system.

Taking off
----------
According to Linus, the only things that stopped him from losing interest
in his operating system were (a) getting feedback from users and, most
importantly, (b) the fact that while trying to dial his university's
modem, he "dialed" his hard drive and accidentally overwrote some of his
MINIX installation. Instead of re-installing MINIX (at this point still
his main development environment for Linux), Linus decided that he would
switch completely to his own creation.

As Linux grew in popularity, he received postcards from all over the
world, showing just how many users there were. Wanting people to have
the ability to share Linux more freely (and acknowledging that he had
made use of a great deal of free software to create his system, most
notably GCC, the GNU Compiler Collection), Linus decided to re-license
his project under the GPL (the GNU General Public License).

At this point, Linus had started to receive some criticism to go with the
praise he had been used to. The most notable criticism came from Andrew
Tanenbaum, the author of
the book and operating system that had started it all, somewhat
understandably feeling threated by Linux (particularly because discussion
about the new OS continued on the MINIX newsgroup). He wrote an email
with the subject line "LINUX is obsolete", declaring its monolithic
kernel design "a giant step back into the 1970's". In response, Linus
wrote what would become the first of many "strongly worded" emails
defending his creation.

The 1.0 release of Linux was made at Torvalds' university and made
Finnish national TV. Version 0.01 featured around 10,000 lines of code,
1.0 contained approximately 180,000. Version 2.6, released in 2003, had
over 8 million. The current release of Linux (at time of writing), 5.3,
has over 26 million. Over 90% of web servers on the Internet run Linux.
As of June 2019, every single one of the TOP500 supercomputers run Linux.
Because of Android, 76% of
mobile devices run Linux. Ironically, Linux runs on less than 5% of
desktop computers, the original intended target for the operating system.

I think it's fair to say that Linus Torvalds has had a very significant
impact on computing!

Sources
=======
- Torvalds, Linus; Diamond, David: *Just for Fun: The Story of an Accidental Revolutionary*
- https://en.wikipedia.org/wiki/Linux_kernel
- https://www.top500.org/statistics/list/
- https://gs.statcounter.com/os-market-share
