# Mantras without chant audio

Status 2026-11-25: 220 of 222 mantra lines have a clip.

**Still without audio: abhivādaye** (both abhivādanam steps): *abhivādaye {pravara} {arsheya} pravarānvita {gotra} gotraḥ {sūtra} sūtraḥ yajuśśākhādhyāyī śrī {name} śarmā nāmāham asmi bhoḥ*. Two of its fixed pieces failed the listening check in four takes ("sūtraḥ yajuśśākhādhyāyī śrī" was heard as "sūtrasya juḥ śākhā…", and "nāmāham" as "namāham"), so the clip was not built.

How the others were covered (see `tools/vagdhenu/segments.py` and `join_segments.py`):
- Lines that name the time of day ({kala}) have one clip per time of day.
- A count ({japaCount}) becomes a 1.4-second silence; the app says "The chant pauses where you say your own words."
- With "detailed saṅkalpam" switched on, the saṅkalpa line shows the day's details, so its chant button is hidden.
- Four mantras whose whole-text render skipped a phrase (āpaḥ punantu, ṛtaṃ satyam, Yama vandanam, ākāśāt patitaṃ) are rendered line by line and joined.
- Vedic mantras are in a flat tone without svaras.
