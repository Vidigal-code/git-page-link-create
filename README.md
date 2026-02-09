# git-page-link-create

> Create permanent links for HTML, Markdown, CSV/XLS, images, PDFs, videos, audio, and QR codes in a static Next.js app.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14.0-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)

## Overview

**git-page-link-create** generates shareable links that render content directly in the browser—no backend required. It includes QR code generation plus image/PDF/video/audio sharing with hash-based links to avoid 431 errors, Microsoft Office rendering from public URLs, and **frontend-only reversible short URLs**.

## Project page & documentation

- **Project page (demo) + docs**: [Project docs demo](https://vidigal-code.github.io/git-page-link-create/ra/#d=h-H4sIAAAAAAAAA-19W28kyXXme_-KMAWJ7BWriteeHg6b2h42e6btvlDNnvEKgmBEVUZV5XRWZjovZHPGAwh-8YvWsq2B5NUaMMZ-kCV4HoTB7gqCn5b_ZP6A_BP2nLhkRkZG5KVYZK8BEzPNqszIExHnHvHFSR7-0aMXx69-cHpC5tkiOLpziL9IQMPZgzUWruEFRr2jOwR-Dhcso2Qyp0nKsgdrH716PLi_pt8K6YI9WDv32UUcJdkamURhxkJoeuF72fyBx879CRvwL5vED_3Mp8EgndCAPdgebllIeSydJH6c-VGoUZv52SCmMzYI_PD1YJIwmjHiRZOUDEgKo2N0HDCCN1MyjRLy4atnTzfJM5q89qKLcJMcn308-m9PzzbJgnk-3SQ09Mj3XwJ96G5oGcVrdnkRJV7aMoRNPoZN0fEmUNwkCQs9lmyS5-xNNvwELqYZzfyJpQ-aZ_Mo0Xr42Pf8GbAHRwXttQfiJIpZkl0-WItmB9llzHRGs3HqZ6zSQbW9nwWsjZePYB5uEnahnCbRJ2ySIQ_yBVyheH-TTIFgnjCY-jSILlLBbI_FQXSJrUgYZSbTK535Cxic1s08y-L0YDRK6MUQxj7Px3nKEnl7OIkWI51xI9v0Rgvqh6M4Hwf-ZOTDowNkGf80TM9nLmZnF36WseRgQhNPG1CaLxY0ufyzgCYz9mdiuPbZKALXFYGic3tyUD2-RWFwph05WXU4Eg1EY7wLthc8WEM6awSNBD7j6EdA9LtvFsEamSdseqtTSLNLNUL8-S_ks-Iz_oAWzfzwgGy9V7kcU8_zw1nt-jh6A_18ym-NwTuxZACXyjaf3yk-HiRRlBm9DQZx4qPiwryCKDkg37rnvTOeTt8zWqUMpuHp7fbH-2y6b7ajkwkwrGi0teXtWYjl0CpNi1bbW-N372-brS5oEsK0ilbT_XfZ1ths5UGIgjmrRmy6Bz_W6f_QoxkdZHPGIwpEgbUf1Zgxnil-4ODHW9NtanYITQpm4Nh3tu_vvGtphP4B7-9ve7u7lvvz6JzxyY939vZ2zAYZRAptKFP-Y22kD4beH29PJrXOhFooFu1s7dC9ezWZzClERdUomY3pxvbWu5tke2d3k-zs72-SreHO_l3zMbQGmA1ya7p9T2eEi_OBP5tnbayfvjO9X5-vwXo7U0rWO-8r1jM23XZwtU0LaqzfG-_v36vLucp6b8p2pzVZd2J9A-dhEhUj0zg_jrxLg9NT8GmDKV34AQx7QOM4YIP0Ms3YYpO8j-7sGZ2c8e-PoeUmWT9js4iRj56sb5KX0TjKIrj2IQvOGWQwFFKanMGdhwnkcJDX0DAFtiS-wdUxnbyeJVEeglzOabKhi9uYmWSDaKXLwmgHQ2WDOUNtOiDbQ0OhUcIY4QZvDsjc9zwWVu9nCYzUx5h4oA0OGL2bEkZTSOL4OMoLVvZiTswSg8FxpAhP_TfMM_qN4poL54kwzGFr69tLcw2behCoB1M_wBBNxkGegBrFb8yGKkZkWbSATuM3JI0C31MdaAprPPnpwIcs9g0fqCs4bSdsYU5PZzUNghaWhvS8FhDfDBSLdrZgRu8Zt2W8JJA7R66gSXZgZNWbnp_GAQUjmAbMoPlJnmb-FGMdj_8HJI0prFjGLLtgpiZRcGjhACL9Ij0gGPxYYp3YMIhmkTG1hiE0ksWfGUVNGr6zX5sYt3DICRjaxZ799oU0nHdMUVbMr5IbGOrATdMDD5hQIdswCplb8vwzrMIWLfLnbDrgHtpgVkEBxIFrxQ1YK-oBySQywMzL5vwEa6oKoT8MKsgln0RBumqBbTt7xbV2jillygJI3CO3W4GMFlh-7uKfojPOzNlb_QkGS6uP6OUcunrt0iKHqLgGP8rOBwn1_Bw4ed-090mepNhVHPl1Hq_AoBrtaWv4bu12P_9WkY9Vz6s5Q7shWqXKCbuMQ40AAwZuhTg1jY5B_HlmmjXGMLDAyQaGLPJdyTRjWIlwMOZy5eZUsE1xDNVzKE7diy38sIg_-7Xww9dfPIHDKIMBl-ziPzyN24LUTfw33O0qjCGdoHG7HM84iCavW0hFfDPAoNApy-C6HNMEzMMuD-eqVAQiiz1zZ8CN74AEbJrVbeuA-OEccsbM6lKs927Ezp2epYHJdgvuYpHaFJttvKF3u67Uu29yH3IMF3M_c3gsvnAbZNFsFrR3desRRer1Xs0y1dqgfuethZhaXmlrVEnfdupq2jPe6NK7vXhTDFQkbEmU0QwytvtbHps5dBvM3MyPRW4_4AHnfj3zh1vzIo89n9-ynHTHZrtf-Mb60qMpl8MftXqtr11Nhh0cjBmw2LTLYuDr666e7bFdWtP-jtOcLLd0jUCjosFghr9hBBsTP5kEsJwWmqJvddwlW9_e1CMOCPHbzTF934xdXDNqVzHM2BqX-sg_BqiSg30cBf5rdE1DMAHBqjgPUkb2hJXBKngQ5RnEpSlCV3ar-6-v2eU0oQuWyoer4sEuee70Weug1Frn7ntAX6ex3-vx4db9CgVTj5Squ9fe79aX3m1qXO4YuBW4ZZW2Z4nT0isUWxi1BprowIpoRnaXE514uJfofrCx1UNSP9gYbN_HLZoGyZD5tps9u8uwRzdX3EWjSWmu27v74KE3rWFAXdX3-O-a-5IXbPzazwZlH4NJ4IORore0N-V-dOoHgQpB7iS0mWiNc8OMznCCbv7Z9kfqiUexz3u3mdOutaPabNnVN1tqhqDheDVv3nVElaltteqGew-Ej2icQ7Owxx6IZYsDf7qlPUBtcJEgBfzXPqz6noa2ArkvliD1cNuW73XYyqrI8Z65adYhJatwzg_57vWtLF5KBoC8i_TbamMGp5X5N-T8y7gPA0o0PUj7ekQbWttGoe5pdyx74fa1uyVXcY-kmE4Dm5werXvSXZNg90VjZZQdF6z9V4ydOa8NDUZlcXcdN_zRc_fZ89dZIjse8NMCpvq05PX6HrIlfLSG396LfjXYNB9fc7zWmLB0vNu1zL2Q3Dv3HIIbiOy8Ljh5W-4bVu_r7MDthRRcDtiAIzDhPcNtwhWY2yJGjURm54swxbQ1ZjTbwL4gA8k2cUkJc9jYwcFDnjeteSfuf916hWNbcoukYbloxK_tHfuGRq_tlZ67CBxS7-Fs913AYw-Pd03nzGUx323KpZr6N5TdirStfBuyNv546VTQwMffcXSCpwjsbri_4lrSkptQXX1XyGmKcW1PxHGwqus-Y-XcxPox5MVRQNP1TbL-LArpJMJPx1Ge-GAiz9kFfF1EYcSBY6c_tsFJzeca6kKR50BcQukPsOlHJ9xeOIwyf9JpO9iloMtDPCKC3DOeq5wXa2KHfVvV1FRX-OJqZy71LJxJsyQKZ03m6xpwZcMfDxHfcLDbawx2tlVtJwscirORK4iIneR1S0GRN2tfL3b1Kjd5oECxv0_c3l1x3IY8gOz0Ctt82H2ObuCPhtFW4Z46Q-Q-53xvZYnBjtsXVLpcPpZXQsb9d5z9TaMo64ZGNjtl6eS6G05hqrtqB8YmJM1r7DlZJubQvh_d9yzYCh3m_pKrAzk1lW6tLDd1-wCjxzwwegz8FBQLD6SbTqyZSuDbkbrSKNw2YVCjS1tFzxNoXQ501gZn9Z29V_CSquDOciq9o3Y7HEcwbMEYf5Y06LZNhW5S0mEVXmRFNipbBIh9GOxwYB7407LxonVWEnJAAAa57WE9TTbJNZwKxB_nxqyO7OC_hyNZAHI4EiV1h_yQdq04QdawiCPGZbnIIYzjqNLBIZU1LN9aIxNYkqQP1vD449pRbYyHsBoJ9TY8zq4d_fs_fvELGBbcdDxjLbixPXE4osYFzz9XPeoctI1Oa1o7DLlGfK-8fKau1qlwSgK4qBEbZ2GVzvtZURUkHnEQLJmHT0_yBHdyn0oijwM6Qx7-1e_h_9-5-NhK5pgX-J0870Tg6Juf_1tTw8ORmI_jro3T6vxZlUOPiqsgNV69kWaQ4a0Rmvh0ENAxVlcJcRD1TBMTHZKRJ9bEcSZDJMI0tFJUF_GSO12FUT5xEoKbSOetzG_ka_sMG6YWZ12n9iv4__90n9pplGT5LL_6TfoWZ8dsFm-d3W96Cg7-vfptFFxvbocjMAmLS3JcrnJBP2ElrIdfeSUuwJx-8j_svRvkD0eFbxexAf2--KryEdkjhjaNn7o964c51ty-uDh6obx_baKHEIO5AP3t-6F4YChKVo-w0pJ8h6gS0w9y34NoMN82CMQFg0QMXqvTkzeOjkUJZ8ySBQ0x7V-uavtwFLvGYELs9cHoN-syP-MV26qCm9A4JtmcZtDvIk5YmrJUHboifghZWlmA_tHLpym58LO5LANnCa8KFyMW40_nYKNizkNDQ8wJmTKUGL0tnhZ5AaawWI1f5AcIo2soqiuMSpP85Y8bQw0PaCYziy6PXshPzgTDTBkqY1d1ueda9a0s0B36kb0OtzbNIjVtmehP_qb_RD22AFN8iqdwH8HH681STqxTufGSs_zmqyUmKca1dvSBn32YjzvPsebfiq9AQng008Gh9yx1p3x0vqOmW4FuK1asnlNu6pt_-BdSat98RyMXm9QUtmonWNw9-lO0eXDvWBUv6-vB8tGGL-aXxM8IewMZUjqsGK5utCV62eCd-bsFLAye71qHh8231az__R9_9hNyWnWkMPtdC7m4gVrFG37AQpaggzZfq8FdoHBrhfvz_AQYEwA3Qs6pcRJdpHAfXSCevqN8RwqeGda9myUMXY8tOyVbfvVr8iwPMj-G0ePGJ83682WnypezPMY3nKTuIMVfNgBe_vTRY_gXvBiL0Ofnnh8J1_9iOkW0YOoHLL0NhuwW1vHLL2VQG0wTH8QRXPZmx26VHe_nfpCJUFfESf56idSfhczj4Vy8-QTMBBnHbwunQk6RUa0c6OpD1Hsu-voQ9VypNr_8MfkTdkkeyxtLOZKCaulIjvHQ9oTGdOwHfuaDE_HDSZB7wCZpN9LD3IorKQZouJIvfkFeCuvu7EcMUhUFGQlX8T1s_uCzOU3nn3MVkNcHNAi-pd8zPIsfgvaE4FpuyFAqQ98pw8hf_uF3PyVnPEfDZK43Fwyv8Tjh8_EGUQheUsv9VJYIJpb66GR5iig4lI4-w2-fk1T4nNtgwW6pCD__N-TBM76HJ0fQmw2Gt3iCrpF7RukYbX5RaIAfztAqwDj8CYQhjyQQSG7MX1YGvacZw9eYts9ELIyS3vPfq87_OE-zaOF_ClEV_tmUO70QHViSRKj0SSJ8imCI9Jinzz8YnX38wW1Mfb-c-t_9K3mKqeeYpsD9CUT93rPfN0InZhKcktik53dSUASKNkbQ_pU5xGglt6f198pp_-S_E2xAvkv4ir6_5d8zVB430kOOVtDA_5R_IBtxNmLhiKV3uZx5T0ShURgWyB-fvXi-usiI733qHRbxIS2V-op8lIL1ksd4fbmQyCmW8fDD6EKs6HmOiQaPzOD6IX1jlLy-nVjIR8bHUs74r_9VOT8xuk6aoBGqqMFHcRBRDxJhzPo2lUdhcIG_sYqrPWYAaATC-GUghPUFSFFGy5EvHKj6GnvT8ot0qOBH1BXuW2_KfvhMI-6ytXXI3yov7vFXc3XlmKRTYdkpTTmDxOu1uIvQ-PKnUeKNTt5MWDA6jS5YcoqH4LkvUbMXNL-XRnkyYQ8-y5Pg8xvlBSpuxX0eF5rcnRGcSIUNL2IG8sfrfCtgkxuI2kNCh4pqU2xJeZprVVmlcq4r8yeBv_Cz3g5FPKXpyk_5yJ7yy0s5FEmx9Ch_wlgsuOIVGWTO1UWtSOUjbqeiHY403Ups6bu6GBKdpISFsO6ZCM4HLJyBccv24ERZIZQFdMZXSPwNgtIXisDPg0ZA5lGaoWPERi3LRh1148fRrGigOKFmk0qsJPPKjw8QscSWLkDRTgBRzbWjp9pkINPNA4_kctJrMOs1IpGfLCL0PPJxthPGENAWKUAhIhvWuJS-wlzyCUbovipbPKjFwd8Wm-Bn6u5SylvS1vX3EkQdeKhDqAdc1sqMISuKllTchB0dYoOjNJmM7nzzxT9888WP4T-CG4wpXvhLaFZe5iWcwyx9U7sj9iGtt_iiBpxs481BA4HCxVnvSqdeXP-ich2XkfrEhA-ozyzwx_WLHJxP66Rzf3RHvtvxTnk1iLC8Nh0djjhHQSAJ66-SSR7iQdC-CikfK9apP__fuEZ7Ka6Spzg0vqfTXx0V5VIZn-DSOwjwVaHI43Diy4UpNOUK6bFzAu4Olq7XVcs4jBdiqR8Ed_gXoH3nW-ApIPbhTvnBaMT5jv7wYHdra-t63BdvP-3LfPGUtk30T5WNLPKoeKfqUhKQ5EsBnFX2zSAZigU85t49W5Lz49wPPMF30Rmwnit-KpJSWHmPpF-6Ht_Fkqov38VTWmL-L-QVv0S-w9dqS3FbEtW3-RkmUxGBUJTJxZ9YncmzskDqdjb55dCMfbli1l2SyQqJSo7yqlhlBghgQWyRLi6glyDndFQuQ_mihJIJkA2imaWp_H0chVN_NvwkjcIbSrC16exUluq21XVP_hg7da80addYJF3_Z3jA4XM-Ya4hM5Y9PKd-gCjJU9Fm4y4-h-FWhiKMPNg3Breb55K2jfezXyouBZ0XZRVKxh6O3BIVb11XDDImqsL9iDfaOHm-SU5fbZKTs7srXIPAuqr_EgThdn2r-_u5P3nNN7qWXYIgxdKL_HG-iNGJIEacqtfC87UaX4a6_UdZ9WH6j5Xg4kVlQNspPHUUf02C4_bTMOYT9tMnpWz26jxDDilRaFj6fM9BI3aQqKqnCJn4Fm4iMxrcPmnGmyxaKC6Z2PZ1JJHQawrjV1_doDBEFv0wCJREJAQEV_qJpCRk2cQoc3URW_hyD0msUCZLnadYQiD8UMWNyUPOQgpDncHoIwhJoWod3AdxiGmT-Gmaq8NIpy9XaRZ9RDASw7ieafzN_7xBUYgBKlE84d_6iUJSqIjiJeNJ_Tifpbhjm7A_hyZZ8bca3pY0xkE0Fn_U4OXJw0fPToYL73qi-dnf36jXot6i2JsRI-7rrjiF6r6z3N5Rxx64hfw55gmwPrXhUbctmuMPHz7_4OTpiw-uLZ1f_N0ffvfTGxTQZI5_qgEWD0pGx-pCPzGVdAwjCrCsR_wFEwUehUvH-KbUU5Tz2FO3avlaw_KvWmnUAVfg7Yce_4Mwj9y5ex44WBn4R7YjofUubGc3KazygUAHysXJGwvl8lROeZymO2W1TWYhXOygyd2vPmTl_o-N13JnSN_LcdE9HJmMb1nGLSl_8A-LPPSzSzxCJD9eRxOWS5Xq4zKPiHbm_7UShfo45J0iNt_sOOI8CKzDEDeOTuGXiuc3PhjPTyd5muJmhVWbtdtHj8ovb1-nwQ_wZDRFLy4_rkKn-y2ObfaPZ7vFUvRmRVfG86dPjk-en53YhhP4ExamfIXMP9z0oCiXolWX1K2jh-LDTQ8FNCpP0OlZxlLcOzqTn96-RtNxlEPwf4i_btA7W0Uj_oLg0UP--_YU9_jF81cvn7z_0asnz0UuaotdYZb44zzjofpY-3aLw6zky5Yxquyykp_e7OgSkbpaLa24pxLc6_hr82td0UWJeuNhh0KY8SV_V9va0f_9NdnZ2rlHnH-Qc0iePXlFpP-ynfuPBe76YE1_R4Sspra-_cIV4ALqL1hS7P3xLWccEsfKEL6Su3_2w9V6zq-SfLnbzBcaZVNQ5VQCQ6LOjzwo_tTicMayk4Dhx_cvn3gb61qzda06XtDg1d_aw_j9vTtGo5SeM48jPtCUIw9nWZTAvLCvJxlbyE7q5OWfV1XPaoT-4i_IOlaaa28Ix77Bn2YPM2GZbGO9rEtf36wQ03rKY2jF-NUn0OuG0axop_FhSD3v5BzLn_00w_NvG-sT0I_X0MnGXfLgqP4-c5iLrJhWc-GjnblGW3tpJVII2YV6ukrswQPJDPI9ss7_RN06OSj4U6HUxiTVh_k-Nl1qaVVqzodMzlqafa5zeJqH8h0dxoO8H_NdC7o88B0Ox_KU1AN5CLXKFaxj5Uz55u9__Iff_XTd-poHwWatvr7JLrRmdcU1K9C7EFJt3dRexALM04hBcp5cqjcKPAyCjXXzz2zUyVleAdA0PkvzVpr4PoAeNLG5e9pqes5565NW71xYv2v3Q9il0w0pKk5PJJ8uKaEfYqFuZZpeNPkJZnEUYFoQO05BD-iM47YbphkaqjLk8Q-pD0UF98a6eAvBusvGahRWOURrT1JphxDDTuhkviHPzNUoqz8K0288ndhWVSmQn-zL4n6xgel98Qd8nlLWDWxjadIgHAj60blVOIptVhYW2t7EFLxuYYw_JRt_ZFoQT2IhkUzFY8MMDzhmd03Xer3ZtDj3GifNtzpZQ01hmZvEwv6CUeqDdDZDKW_8ZQTCBvW0axnc6MwDJQB8xqlkPELZOGDvEXSgqTv8sXhqIzQiScN14tnUg6mfpNlgMvcDb_2u_kynjtB9Gx3hvMAnfRTHLDmGxN9mkp_XrMBQBOrpZ1hMu6sFbv14EwzBcFzhgYXN6-WbIdYhObC9G2J90_WUeP8DPreiN0A4u9KwAuzu1l7n4ByQ2mXH0ah99obRLyJsWJyNcLYUC09sK1Y6tobVQnlsq5fKNz6hDrfgQ11r4RsJagfbkKater3D84Z0b6hevXUgO_pELPXmHQiYerriCvPWEexqSlGvEO_wuDGBFdSE2zqt1mkLhhuV2o2P6XrcvRS7kWRNk43i6Q4PG7xbWbl0a9c7uiswyp07PGyMezUFzq397urMthQodyBgDHwFJcmtne5VVKRaUtzhYWPE1ysibu1vXx9svQi4w_OmP1uu7Le1o3v6QM2y3Q5Pm4pwjUJda29l_awMDpUKWvcjup_qViLrpqWVtIpBmEWtbY8aTHqLZazukepFqDKhqJShtj5pTPImCk_dYyjLRguTKwtHWx4zBr7CUlFbx3oBp-SzXsLZ8Iiu0p1rNBvomQnH7dVdNvIlLnmDRZQtbXFTmSf4q6mXtPVm1C9KP2SpYGx-uCq-thJFG61K3RpPOayVa02P6oPoU5pmo6lXcslE0lnL1fC8PqROxVo2Wnp1k_TRRn1Tw1PVtVmXAqYGYrVsthhI60OGQd5wkVHLcHaMxMAW2VtJmDO6jbKglkFVkl-zrKf12VpWds1CHrt3K-privWQVmHjfkTX47YSGjeVsqSkdePEXkCiGXJjCYmbolFIgQTLUoouj1lDurtwwk1SLyFo3htyFQxwbjSVDLiJ6YfmucPm31vbG523HZJv4md5MpxT4mfDW9ubiWDLSXA3PePgM1-2qUtdnqoxwnXQ2ZoglseG1fZsQ7Oum5LGeV6-6G_adqmc0uWTkB8bRszDKh9zY_g1z8WKHR31xf1Al43SypnSZtXVz31yddFPfjZNszyIyeeqfW1gpDolKfRBfWliptg_dnnA6glD4TDFR3djeQYQG8tTgA2N1SE97kbU5wbaeHCOU-YfGhryU268pfjUpCHleTOhJNr3hscKU22zW-PElmarTZwpzlFh-74nqVoUS5yG0gJZ63mo9SqgVCUfZ10BIIbAD4XuxOoic-MVFQjIV_v0BQzEcLgJbcCArr7CtRLrjQA9jONiRxps9OpL4E8EDl0uioFxYkV69XuYBVsI3AdvgbP3g_nVl-fM5xfUhuCn1IsSpoFBRM0G1D2LOkJBH_vp1T9HkC4m1JoiVOAgNGdCI3Lun98EItQ2Fisq9ILzMBIaBZnblH4KjIDYza9zSMietjVCQk9NtVgGFEoKgZhixKEVYlxogkdwCCYRwn_0nM1QxLCWXCwPCX189WXiR6lEhKLlICFIhBpMgm-ohSUkBBbCMaGrL3HvDIRBE8hbzmEQYjejNyj0cOHPkHEBrNUK0-kPDT1mPrAWLaiwQ5BwmAKThdGL9TO9-hVqoeoIbX1ZeOgl438mHRQp8cOJH1O_B0pEYzrxPYqGjX8RKYGH0cFJPe-PDQmV9pTirQYeYi3gkKHeEiICm6KYX9lVoQUpEo4RXBxdAip6qjlIMkXcaMAwowWlmFx97fkzuCzwoquvuKUyxARAK3BPtsCMlsKKzgo6Iob0h4teKpYKDQVR6qanLE8zPLl7CP4jiYBdEj3y6BKwEXgz7ow8jHzXwY0yCi51HgnoiI-dg0bFlBBIIkzaIlseOuL72BgG0AX3B46OC5fNiq1qGOP_YtyEOAiC2-58MSyCchpHqWNR3Ak6YosOCu1CjiZqf0nwUYOOdMjI418oKkQv6OhxkL-J-ON5as_na-AR8C_iJ8hwYIsybZroYukJHpUyoUmTEbkhpJMQwgMkCzIiIYiU4HcOIKEYuTzL2MxtpzNwRKL8ergRz2WF0fbFjY6jAKSzELBmfPV73ByklZncAnZUhBgnWOuEjx6OIQBX4KMoRDfMCNPSJ5SVMjnMmX3PzmMrWsSRImEFwKSOiNEziijRnJJIz9IwHsOvKBUACOORucjYeqBHz9UziGMsYvAvi5Jk4SzlkAWQFCGEFAk5Y9YiDCElM_BSYhWgACSBKMnkpiH3smFIj0B9uoJIz4wReBBAF-AqwEqBb7FwSQJOEnnWuZ_BPciwQNPgQ-SG_Vwg0gnegOtUS4m640gIstJUz0zLBA0JIpSU-tnV14nDhp2QUuQBCyJxIpZnOP1QJSZRpavfwGj4CBOEC6OlMCWxj4VrCT1_7QgpAYtS4fIdWTGX5JIAE4Y6mFsPfOlFiCPxuN5k8nEIy14uYnJvZMkVbLsBS6DdTkwJj3YBj_DPXVrarQxQqgb8JRAlxTp9kBYsiTmQJHhqRUgSD3q-mFVvJIk_7DF56At9Yn1gK8CRRGBLrr6MIeJ0hJIeTvCgg44koW6IRQavMeyOJrXtuzQASogkldtNhi-4RSxJxHcNSyqyrVuBko4F3xWMBJK4PQyJSRApJzEscyhEF7ErcOMQkr6fhu42vPoK3IZS49tDkJ7LxSfh62qMImSRQ6AEZqwaRGrbQrQASWqTphuQdPIGmjt9rgNL6oEjwWfc8_mPCiRhROkOJLUyfkkcCRTrZoCkGWScbdQVlHQWje1nm2xQ0lJIkt_40P9nOJISDAJK3XGk06svZ35ItbzTEwS1vL-Mas1wEku7wkmX5IP86ivsK0BA6RLrrrohSgyGGgZ0wnphSpDYRtjrKjAlasGUwKeA0w2rmNI4EEVHbjzpspjLJOqOKL1kKRb0dQOTYFA3BCY1DMOKI30_v_o1JCS4XRqgZnGhAwsEkgT3loWSTur6sAyYhIedNXloMqyASaEmcVFpJHbakdMwMQ1V8sNroEr0uqBS1AoqgeXDpOuwEt9ZA8HQZDK_LqpERVFIeB1Y6UM2mfPNocIUL62w0sS_-jrUzPRyaVjpsdhWRT0IQJ5LQUpqwyPg-zWlxvfHlZR-rxhZumxHlnRdhwxXgkvXAJWi5UClk4qXrMBKoQkrCZO9JGkklgbXxJQkFY_JIHINUMmTiJJudyWmpKxOQUoQNvJrQ0qhBJWWQZROgZlyC4Rvk179FjGlqy8TOXpRiiSMTsJKCUY0YYwrwJWEL14aWSphpVgac4ErYeohd7lDDixhLt6FwzcLLQleatAS-LkADM4PAqphSz3Lkh4H-Sd9saWrrzVwKSQBPF_kUODLJlURLYkyJU0m5YaYzvIxTyFkeFJ1SnhJDIdLlYv3snRlhPUoUCLRW4OZTiF7IHlowEz6RG4BZtIizlJAE7MBTTiLiTJNENbyMNPVV0viTFe_5jlaGdTG9JOIa3dQ0gyWwpmeApGwijWBzwl1wsqLamAT11oDbRJ2pqCey5WATbCgTdknUeeipdLeS8hpDLPhkFOAmJPwVRbMCRQTNzGlgPtjThMBOmkZU3fY6ZgmMcOgqSWvPIPj9CToFPXFnE4-YZMc57Ys6ES1UiY-OCYoIpOugTuxcEncqQI7mVnz7cJOj6BzE3i6FMDTRETtW0GeTsswyxrKmS516OnmapmqCcFS0JNknj5KC_Z06cKeVlbFtGrs6SZqmFS064s-oaMjtII_XZb4U-48fucEoBr2ahoBKD_SECj21qqZROCvIFDhW0SgLm8RgaISgYJVJ9ga-DKVPN9CHZPch-P4k__24SceTtBRLsa-Y0dzefSpYc_RVsGkZNARecKo7HS5q0Ke_uMBT2xMHVuqtws6TRynEVcBOrVI5j8xpwbMCeSyKsxJrCQ0eKCIZibyVHz73PZCRft78qzvIGbitYgtb5D9YfF26h-ZbxpUBIrXJcoL9lcmik5fM3xFtGxoex0iT6Edb1DUK_5_iBP7EfnOd0j96g-hlx-5XqSo-jZeE2wn0uU9heWd4qP-WkvtZbGy8eFIvYP7cIQLT_w9zxbB0Z3_B_QV2JC80AAA)

## Key features

- Permanent links: `/render?data={hash}` and `/render-all#data={hash}`
- **Short URLs (frontend-only)**: `/shorturl-create` generates reversible short links that decode back to the original URL
- **Shortest short path**: `/s/<code>` (recovered by `404.tsx` on static hosting)
- **Instant renderer links**: internal content can open directly via `/r/` and `/ra/` (aliases for `/render` and `/render-all`)
- Image sharing: `/render/image#data={base64}` (hash-based, PNG/JPG/SVG/GIF)
- PDF sharing: `/render/pdf#data={base64}` (hash-based, multi-page)
- Video sharing: `/render/video#data={base64}` (hash-based)
- Audio sharing: `/render/audio#data={base64}` (hash-based)
- Microsoft Office sharing: `/render/office?source={publicUrl}` (Word/Excel/PowerPoint)
- Link-based chat: `/chat-link/#data=chat-{hash}` (chat transcript stored in the URL hash)
- Shorter render markers: `#d=` and `?d=` (legacy `#data=` / `?data=` still supported)
- Global shared-link behavior: `?z=1` = blank/silent redirect, `?z=0` = redirect UI with header/footer
- Supports **HTML**, **Markdown**, **CSV/XLS**, **images**, **PDFs**, **videos**, **audio**, and **Microsoft Office** files
- Secure HTML rendering via sandboxed iframe
- QR code generator with size, margin, error correction, PNG/SVG export, copy, and open actions
- Theme system via JSON templates
- Internationalization (pt, en, es)
- Compatible with Next.js static export

## Media sharing flow

1. Upload an image, PDF, video, or audio file on the Create page.
2. Generate a link that stores the file in the URL hash.
3. Share the link and render it on `/render/image`, `/render/pdf`, `/render/video`, or `/render/audio`.
4. For Office files, paste a public URL and generate a `/render/office?source={url}` link.

## Link-based chat flow

1. Open `/chat-link/` and send a message (name + text). The browser stores local date/time metadata.
2. The full transcript is compressed and saved into the URL hash: `#data=chat-...`.
3. Share the link. Anyone can open it on any device and reply while keeping the full context.
4. Use **Reply** to quote a previous message in the next message.
5. Use **Copy link** / **Open link** to share or open the current transcript in a new tab.

## URL length limits

Browsers enforce hard URL length limits (often around 2,000,000 characters). For large media files, use the "URL" option on the Create page to generate a short link that points to externally hosted content. This is the most reliable way to render large images, videos, audio, and PDFs across browsers. With the default limits, PDFs and media files should be ~1.3 MB or less when embedded in the URL hash. Office files must be hosted on a public URL and stay under the Office link limit.

The chat transcript is also stored in the URL hash. When the transcript grows beyond the configured safe limit, the UI will warn you and prevent sending messages that would exceed the maximum URL length.

## Project structure

```
src/
├── pages/
│   ├── _app.tsx
│   ├── _document.tsx
│   ├── index.tsx
│   ├── create.tsx
│   ├── shorturl.tsx
│   ├── shorturl-create.tsx
│   ├── r.tsx
│   ├── ra.tsx
│   ├── chat-link.tsx
│   ├── render/
│   │   ├── [hash].tsx
│   │   ├── audio.tsx
│   │   ├── image.tsx
│   │   ├── pdf.tsx
│   │   ├── video.tsx
│   │   ├── office.tsx
│   │   └── index.tsx
│   └── render-all/
│       ├── [hash].tsx
│       └── index.tsx
└── shared/
    ├── lib/
    │   ├── base64.ts
    │   ├── compression.ts
    │   ├── chat-link.ts
    │   ├── crypto.ts
    │   ├── download.ts
    │   ├── i18n.tsx
    │   ├── audio.ts
    │   ├── image.ts
    │   ├── pdf.ts
    │   ├── video.ts
    │   ├── office.ts
    │   ├── qr.ts
    │   ├── recovery.ts
    │   ├── shorturl/
    │   │   ├── base10.ts
    │   │   ├── bytesPayload.ts
    │   │   ├── dictionary.ts
    │   │   ├── index.ts
    │   │   ├── refcodes.ts
    │   │   ├── shorturl.ts
    │   │   ├── typeCodes.ts
    │   │   └── docs/
    │   │       ├── README.md
    │   │       ├── pt/README.md
    │   │       └── es/README.md
    │   └── theme.ts
    ├── styles/
    │   ├── GlobalStyle.ts
    │   ├── theme.d.ts
    │   └── pages/
    │       ├── chat-link.styles.ts
    │       ├── create.styles.ts
    │       ├── render.styles.ts
    │       ├── render-all.styles.ts
    │       ├── render-audio.styles.ts
    │       ├── render-image.styles.ts
    │       ├── render-pdf.styles.ts
    │       ├── render-video.styles.ts
    │       └── render-office.styles.ts
    └── ui/
```

## Running locally

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

### Useful scripts

```bash
pnpm dev
pnpm build
pnpm export
pnpm lint
pnpm type-check
```

## GitHub Pages deployment (short)

1. Set `basePath` and `assetPrefix` in `next.config.js`.
2. Run `pnpm build` and `pnpm export`.
3. Publish the `out/` folder to the `gh-pages` branch.

## Themes

Themes live in `public/layouts/templates/`. The catalog is defined in `public/layouts/layoutsConfig.json`.

## Internationalization

Translations live in `public/locales/{lang}.json`. Update `getAvailableLocales()` in `src/shared/lib/i18n.tsx` when adding languages.

## Short URL docs (internal)

- Implementation docs: `src/shared/lib/shorturl/docs/README.md` (also available in `pt` and `es`)

## License

MIT — see `LICENSE`.
