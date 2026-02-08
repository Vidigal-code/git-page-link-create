# git-page-link-create

> Create permanent links for HTML, Markdown, CSV/XLS, images, PDFs, videos, audio, and QR codes in a static Next.js app.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14.0-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)

## Overview

**git-page-link-create** generates shareable links that render content directly in the browser—no backend required. It includes QR code generation plus image/PDF/video/audio sharing with hash-based links to avoid 431 errors, Microsoft Office rendering from public URLs, and **frontend-only reversible short URLs**.

## Project page & documentation

- **Project page (demo) + docs**: [docs](https://vidigal-code.github.io/git-page-link-create/ra/#d=h-H4sIAAAAAAAAA-1dW28kx3V-16-ojCKTDDh3ci9ckvZeuCs63F16ubuJI_ihZrpmpsWe7lF3Dy8rC1CABEECJw5swxfZhrOJE1sG9GAIRgwjT-E_0R-wf0LOqaru6a6u6ssMh8sYpiDuTHddT53rV6eK23_24On9518_3COjcOzsvrWN_xCHusOdGnNr-IBRa_ctAj_bYxZS0h9RP2DhTu3F84f1W7XkK5eO2U7txGanE88Pa6TvuSFzoeipbYWjHYud2H1W51_Wie3aoU2detCnDttpN1qapiwW9H17Etqem2htaIf1CR2yumO7x_W-z2jISJ3cFx8mzB9TFwoSfB2QgeeTd58_Plgnj6l_bHmn7jq5f_Sy-dcHRzCIMbQTrJPDBw_h94ltMQ_-pVPL9uAf1yJfewb9wjCiwYV26LBdwwiOgDSM9hxG7ouxkgM-hEfMZT4NPX-7KeqLtoLwPPqMP39BPow_48-Y-kPb3SKtO6nHE2pZtjvMPO95Z_XAfsVf9TzfYn4dHs3KfPRW_HHL97xQ6a1en_hADf98i7zd2bzRZb07yvuAwQpYokSbbbToQC1B-32YNL5u9W7faquvoe4xvGwN2jc7VH05ZpY9HfOmO7e7mc4dezjClrvdjfbmpvo2ZGf4ctAebA5u617WLRvbvr1Bu71bagFBLXi9cXNz88ZtLcnes2hI6-GIIVvywdS-kaGgnOCA_xgnOLg1oIO-aYKsw24NWoYJ6mmTmOCNjZsbtzIF4gn2e9Yma2sn2POsc2VCA2Di-oCObQeWvE4nE4fVg_MgZON1cg85_zHtH_HvD6HkOlk5YkOPkRf7K-skoG4AHOPbCh16tH889L2pa22RE-qvCqKtpQv1Pcfzo_c4O-U99M3qIyYo1m7cSL8NfejbRp2xleiOtBrdgDAasHXR_uyBlh6o9pivUCQ7erGqa6ooSvELQw9WpT05I4Hn2JasI16vGcS67bMx6cAv5b0XzSkI7f7xuTJnb5JRCK_qtmuxM2ix1WpVI5GWIg1BkrrUwxltdSY0O_TXudWanN1RXktlBso19NLvLDuYOBR4bOAwpdr7U5jt4DzqEyY_oWBCeiw8ZcxNl6UgQm7dBnYMtggqIuanC2Dz9VOfAqnwd_rlEB-3U2RPzt3xhp4y45xhFw6F99Zq3NzMrDMXOtDjDDnb8PpUsv5NdV2LBEdoCtDjYI344ruea1hsnHDdBrors5ZrvJFZ4Uges2-SUoOiS_360KeWDXRZbXc3LTZcl0OWJmhtnbx9s9-lzNILFlaeAmVvqT0tsiQZVtOykHl1ksRz6Qlvx_ecoDzXaFiwcOSpJQOvbYpeScAc1gd3g4gPhUqM256KOjiyKdWUW4sTjau36HN2wsoq31BXObEIrcbtTPX-1A9w6BPPzi5gUvNRxylSedzg10NvOASnbh4yViJTEc3nkb03LTG5q5ESp6zNW2CxtkbeSQnzHSkc7TqcjmDyWnKmFkrfBh87xB5g_30vhPhgtX2rBapuTT92pCEF3agOeQGzGgtdx6inRsxXrRo3EXzp9esZt7qh91OWpuzbGT0gJh-7Wd0cn8lnDli8E2U1kUUGjne6RUa2ZSX9CZVIW1s9Boup6oCY81dWTD3THoj9VOUjnb_msEGYeegLwc7EemLK6uME7ZFsEF3HtO_bfh90GA1Jp_UO2Wy9s078YY-udjY316P_W432GsE3nHknEMyCmwdFlYWhLiycmN1k6gSMbAipBH-z7k1DiOwHGNzrpfQrx-x84EN0H8jKaYpi7-CvvkM-JB64enZ4zo3GHWgiWWwzXaKdfJ9h8FFbF9gItZNlGoWrsubJrB2K-G3mkeeI48Q8WNCRWY9QGW9WIuV4Nat9e1O10wtOoEetIavg8ZSyINJX1vjCef58IVkWnWs_pPXeFFp3F3fxyvmeedNdeOVC1dFP-Gw3haOmWYIi9yLJvPmxzI1MjJofq_AiGv_A4N7YLgcN5g_VzM4-kC6yZTn-hkZdFHgRah8x_pbTi1alV3Nukr6qprmueYRanyvhB_GPwJzs66v1zuQsY-7P6sGIWmiOW2QDxtCGQmIIrXX-X6Nj6BxIg1ygBVBjFbBhXEFZvc7BWbP67WgEQLUWmiIL4wRmVCI18Ko-inQrN03BhG66ud4d92_n9O66Ez1UHU8RtwIyM1PCJQRB1zQ6JrKeWRVUaCUUqPGmfpBDH4TFYATwnbKo8ATGO56gLGAsMR27ASruCaPhKjry9YEdrpOx7YL7v9ptgdsPXtHAX1vTcUeOaupTXx1XJQizZNyqeuodlaUMoQj-5OtwdTJVVMymRsWUjd7SyqgNC0C6rUgbdW-uk9u310mnu7lOzEoJx6tD0CpqlPzFHXXz3MVC7zYDQWY6UN3RMkJnxudT4TodmmRGWuue4_WP5w0vxWYU6p_W5u0bN26XNoMJx4e723qctpDnUyiVCeg1ej9ynUScmCPh7IyCHinGpq5AyM3RdGJCZk1bEeyRE6-X3KfRYXOzLRezZ1tpD-dabGTMSccC30enS_I5-PK3RzKRZs6qLwY9Xa1yuFVFOejWTr8jZ2RvXRNzulcF7m_KkQvZRI2US-0GL6KlMgFprsxHaCrfgs3ZMi0hVmK2nqMPSQTUV0wtx158TXLFSHSDGS6LbxJJg2uWl9mmT-6abVTY70lD6JZ0Gd44l5UxhZfCZnzOl2ECY5DnUgxhxcisogqcl04V1ST-RAtZP9tSdlgSrU8yMbchdSuVULNy33OBkDRYWScrjz2X9j34NPZcj7sGpUUAf8o53DiR8lAldzIs2xfx9xYRcWohPJGcfkdhcHUwdVQ_l51VkR1OKrXGHE4UbeKaxV2-F1p9QxGQnO3B8vzLqeVOx9c4GWOz9c7lOYDlkzGMuTCcf4ORb7vHGUHU-3ep4JT1R_WlwjrtzXxYZy6p4sNGul59QFjN1SraZi4PC8VTvgpsKNmx7QYhDu0ahN45-JqJa0xEzjWi4zHmRF-xd5XZ98_R50YLa7CrxQ5sbMpFttJCFBx4XrhgTikHhKrlXHX1iRpJhGkjK58V7ROf2RJTQxdWt518dWvOkZFTi7aYMoBrabxWaWiqag7HDsDHwzMBeXmZSiuZCDET_ZmDP6UpOkesWXGTdpZ4XW5EWpVeQUXL9gQxKiY6JeVDkz0gpMv0urK0FhE7mUGD-oGS1YRY3bwB1ndNmeAs-SW15YBjVbJp4sSTzH69WlDZKU0jhLd0NYQPZZJWEMdMjUQqnKLqtcP-MG399CXTCbmR34yJRneMvmYqpQh_bzfliZ3tpjgUtY2HJuRhHhGEz07zbFv2CemD8Ql2aunE-dpuamzblIx8NtipvV2LymPutVKKlwQD5ibL8N2l2u4ffva9H8DY4KWhjva8kq7GdpMqDxKzSNJQNzqRDBOVTiZj1ojn9h27fwyP-YPn-HJ1rUaob9O6Q3vM2ak9F1m2vKKm_RkFbCtqPpr_t35knH9TDEvzJjG1TOa0sX-RUI0jwDp8YiP4wHZq4t8D-AUT01fnTXj8OBtIujNl4ozdH372D7-D_39L9twhGIHRdlOUKd3IJOSN_AL-_29y6PnhdDi9-FVQuR085gZt_EoMBgh68WvPyW8F6M5JoqM8EFhlr9SjxFchUSg_4mtibWJ1kCDqdmQhYgHzVYHZBsXHz2yJs4xYosG1Vs0gDaO20sAkUx9B8truUs8Zbjcn6WEYxVHk2ukE0R4PSeD3YdBhOAm2mk140AhGNnOsoGF7TV6zeWCDngtY_fH-cwh0GXMbwQkwNHXCnRo8m7_hJ2C9Gu8H9fZGo1XvOeDeylbli_lbfn4-YUf8QGh9s9GFtqdMNj17o7KB4DEjFRNZfLpxRbo5GhasnD2kTh3XqgF8NJr2cHg6jmrG6hxz6xJJYihjn3xMnvvn5Il3mlG52n5lVxCBNV8mhqDtONNvnDiGPX_3v8hLm52C4iKP7PDdaS-r81UplcKWoKIqf_JrRgQ7SgHhN9SSgoUOHp4YjoQTRvh98lQ-BKnsZKRSaZILpbZFIa4Z4moP79oB-L8Qz4d2n5yyHsHTjnafO7VgkWg4AxJA0m2HBcR2Q48E8YlfrgQaJNNbdBLYxm2W8cRnQcAsLvLMxSW0iMBYnXPR4otnB6AZfPbB1PbBqQGHmkeIDCoEMC_mN5TFmlzZUg2AUlOYQLRUX_zkl-Qv2Tl5KJ9rVishaegB6kQsKYzU1xUR00j4PnFmTb7vIybWVafQEEslJ3EYq3F-Vhvm0DW0NDE0JNhs1g6uoOCZIMR0vCgotpGTGBnRYNQAyeet9SCibmR0vnbSIR3Wdps-MALzv4x1dz7Epj4yez5ZzXcpBP_-__z-t9-uSnNhACOi84PyZJ8_q0Rx2Ywk-ZNH6-Srh_Dr6CX8erT_ECwr5QSuI2EtKZTV6dvk_Vw5Zb_7d1XJOrEGMSM_eEgeeP3pGHitGlGxEUlRcE8gOApHqIvYEIJ6ICLqUgjGUGVBCAC2R6gTGQnMQ13o8Mpp-y__WZW23EuLqPuSu2yVyCrqC8Ly6gShLFTmgsQuT9PnD0Grz0FG3sHVE_I3VQnJ3dyIkHfxSyU6iuqCjvsztuSPF6AeFQO5ahH_p6rU8wYD8NQj8j3l3yrRTzYgCPhXnm-tk72zPnMgGvFAsA_xYCZXnI_tvu8F3iAkohfylKdhzkNcTw7zqqn706rUHctYLaJvFLuRL_FgrhKh47YEqY9YH7wivAnD6nlnRFAGXLoq9BRtXD0df12Vjh_4EQUhkr0vItkKpIPqMriegtM0tl9xn1oGxWQY3Z9ThXTgHTTBL7h6_fjLqrTjWFbsG3FsrBr1ZAOCgrw-Efe0CEPz1aOnT0iEvVYy2Ae4t958AHx95WT81j9XdjHbt2ZiPHVCG5TXcEqdag4mNiKdIQGkMbwxRiJz3Ak6glHB5yp0nITrEO7B_8GV0_F736lKxwB1jh2ex8661EEVqBg3ISiJmhTDn0gV2uIAcCVFKKoy64oJ-MUnryvTj6MIMfX4t2rUEw0I2j1gE8c7n8E15JBHQBVIB6HmPYEgFNAu59GSkQWZhRzMQKDvvCYvApgpuCriVRZcMCINsrUCsCF9gMDEFpoKcoxmUJ0TucgZiUum6dDA-_fSYbLwQ3J4MLt66Q6SgHFt9x4NkB9Lc4KJDPrdrLjGRC2fwemiyRpguuhHwu1pkD0GVbiBw83-MYfuIogN2KxhIJZJbhJT5FnRuXs4jvklL-DYupkG7druI4-EXnxXIUcZHHu-1jpgoyiMlZx7U1-yybxtdcH1wh06siIvK2QcD1uZv8UNaFEuUgL45Os1ocfe_A1vSsHYItvoHeoxMf4mv4_tpmkZTVJgVJPXXRUVQnZxYYXiHAfTo3aXppAeYzrDNVFIYr4FGknQQUCRMeLIORtvP2FnIfNd6pCRF4QY7l0rPSQmiIroBfgV1BLTIKtf_OPP240ueXxvbR7BlK12uMifMD9EHYcQ7I2NBZoDnfTi2YEi5gKafVsIu-iinLjndrWB0BL4XaCsQFOJrac_6Q7hxuSC0nFJha4JYFqIC0LLf6RKY4afG0k0A9YTaDpa_wSkfr0UBU4qoSZwd2FBJcFbBBWxx_c9F9MQvC29foBXl6YdeDegG_7G88Z8yRDe4_SItj_-pCYiNZELbMclFQLrwG3y0HYu1cG4a51Qt18IHZShxmWoixQeb6RWHlCfhuevldqQk0PNcTjtQUTBsyVwT3we-YtaiyMdaAeBpAEmBi3SYBexTTwYlNYd4vWXA4in-mznw6nvLKI9os5AgTyLwP_0RsuftEekPXI3HOKSCoFnmw5x0Cp3Hy5Re7xAIDk8vybKI94oMeMlmh2UyPegvu1NAyISOoPrpTlgZqg19jD3msu55_Mc_XkkD9vqoOLH3G6C-enceouU_nkb7KIYUwd4eszKRQnmtkAl7J3hH8kgh08e4Uz5TtUVKYPZ16WCutTvj2aA7rd_8Pvffpu8652S_RCN23FBupgBq08WwUOxJXRRfNI4j1_V8u50XNtt56iKqFbB6o82MiQJ2hFVInxs351Mgc9HGwWNTQg_gIA50drTIlnyQ19CXbwIQKomvoc5I0GMnqIxSkGRBtHnveeozZxXl7IQneUsRGe2EDFsvJxl6ETb2zmIKFkdvrIna9d2EbrLWYRutAg8LgQXaTkr0I320-BFnHqbiEGvKdE3lkP0jYjoaGgj58laDuU3UpQf95iFpAcvHvtG6PTaEn9zOcTfjIgfRwXLIfymonTwnKYlk8_lwVpc80sl_hv3OvA6gJnX8eN_Q6_jOTxzgWxDuyhJPb72ocD1iC8dyPM_5IKphy8xqeDHfD8mn32T1ZP34NR25UEa0s7TDoYhRHftmE6ccie3H5KHmKJx6mHmT9mFvlwiQVD4w_lJNDsQtAwSYevkiA4YxoVvijzf-fv5yXOEbyyCfo_nioTxy6fS_aMj_JMAXz16czT6wU8WErRDvlG9BMok_c03Jl6_np8wX3uGKAvooGVQ52vPkn8x8U2RBxPn5iXPPk9wIzJpbRk0OpIZdtfVDMvLcWaW-JOPyb54xje7KqRzyaZ0FjmdfRf16Xh9CsWfTV1ygB-dc336XfqUMb_bprb752TiTsZEtlWCz9SaFjsx1Sry4VJ3TrQFI2rZ5umEuQK61rYYXWRT28Xzo1vNJqcI5iNsdVutloS0NUwz0bLM5a1Mb2o7QKl7-A_P5Tr0PWvalwxRcYl4Y3MsEOPA29LXiO9iRanrIuAps2LeNGy-uQWyeLZpnHWaTDk1LJDnlCRY6s5Tk052bIxWBvYQT06UIZeLrnCfV-HWqGCzBjtAvVCm6RmTkS99Kc06JXrhu1_BqOqaIyRRpspwxM8wRzMmPZ-6_ZF-SFno-GptgWOP7XB2avgTHpNh8H_AX8yHA080PeTsjNzzvdOA-XilLhSVZ3Q9QnuYstVZB62I__M_bg3RDxRskIegnxzgXSYPfK_yu4hkAsR69qQ3_kwDfoEJWYEOVuQ-C_aDujfODHPOszsv2jA86R1k1I56N47xKkvdRX2mKyvfHmzeZq2eUT6D0PfcIYSIqFSZa3FbHmzhzTj8hb7W1FFmkdIFurvuzY6PGasA1n8Xj_7GEFN8oU-ct1KwxQIvD2YLvqWuWnFtsTGPfxaNb31zLhNH-VnOdvV2c6rZ2qnkwiXeis_i5qtE2STAlbqsTZXobEG96PPCYBLAhL8PBQzmQTeziFqL3XKxK43TM8b_9pXnn-NNFvlKebH7PHYP8LzuAzb25uipytyadhBM8W4XnJsfkn3-1dxploF0zFN1YaPD5DTHPVva8jZ7jtdrjqntNp_t3X3weK8xBjMgPi6b-rOu7z998vzZ_r0Xz_efPOIDQCjVt3tTTOwlj6Y2Zhpc2WDevfvk0d7BUzkSft2U4w2vmi2eMZEeY3IIK7EEum_vBw3PHzZjWHMOip6enjbC8wmYf0T80CeQTSZhwMqtcptl1fsxSMaXTAueXe0SQM_jqcuj_6VJZW33K8mvy2ZzCD_8IX0Fjhd4iJ_9KzmC78vuEwLQY470fIy-3vECq6h-zS6ouIJStbWT3cf7z4m8iYv876ek0-pskDTd1ZBvovMIW1FY9ZhC6MC3lL_46c_Rz8YoGz3S_oxnJtqBbzcjn0F8FbI0KwruQhDGlyij20d2lBsnmbulPMGf5N1rW6SmNebrhlrco4dKS71zTde7ci0VDCF1MVVulWjQS71o6vLvldLNSbnyCSalXvpkqpW6ZQnqKfcsFVSLSLjArUrGHlJXEUEfyWNNRZXicZW8esjY3ux8BLaWvLont0rc_xwX9RgbTl50A22Lq24KSkcDKb7YxthQ8loYaIlfDFNQOOrVdA2MsXoqzxwaEIFaUfGou3kuTTG2rdw4As0rd44U14zGZbxhxNhEnDELtaOLOvIKx_o3_1oOYxOpqy2gHXG5RVHxqNfCqyzM4jq7CwIJnLgNIr9KLF8Fdz8YW1EuT4gXqbhC1LXpsgRzC8n7BrBD_r2oeNSd4X4BXXXllD63iZlz-vqKyWPtsco1MXvqYPjM-Fc_AZ7XeNDGpjOnsXOrdDhrpI9c51bo8uHrzlXnVtvg1XJSBXNrb8YU3iKas9GGusmTviWMYvqsbFyh9KHY3DbF2pgOqOZX7UjapU-h5tfhy8SPkuUcMs1vYkOYpdQRUkONlOmfHY7MKZ21-jmnCHPaSdFVOdGXV43TVD22l1chS9DMqby86pyY5jN3hqp6Gy_24fKrlLHzxdY9dfoJVyt9_qmgSkK3JA85FdTihBYnmXLOMBU0wsltOKFkqJr0I9SzN-Yqed6E4YiKuTFB5MxxkZwKnMT6MyE5tbqCOsrBj5wKnJyZ0x26CokTEtyYZs9IGGvFhwgSloIfI8irEdG_1GEAc0OdZNextc0rHy98cfq7uZnurNsoVTyvcOzgaBO-zTU3Zt2kkqPzaqT70qQ4mytvzrqLRTCvtEpKbVKvroFEYixntmxqrK5WOo-HV1QyefJqiUwcnNosFyevvMgPgfK6DJG8ijJvYebPJp1ZXcXUnjTCGuqudE6laAkuf0-57PZxLTW2j9JDnYTLQ-HsyA2PkTiYxATmVwDDuTMc7uIzAcRdvOaROyP9i88te-gFYAkqIHEv7eDiPzwQT18f05VD4y4-JdMxJZRjcBe_wBYRlGNBePEaoglKPpiyGSIHBf0PpvYJjBUCUkEIVGXUh_BydPH6hNmwxk-FRr34neVh-1zXAYNYfK6gtsDoUviC8FxIEfJB9y2QAF0ADbusjyrVQigXE0FwIhYwjsTrKgB1zzC4DGC4h6BW-vaE2qXxOo7SkcPZMpdE7LgUJLkDKUjh6yvm0nGCNK4nQbsjmHKPgoLGycKkvby4XsHu7sfUp76IVtxFMTyxrGglcCi40HyY5ZC8CMVDkj94WB7KAyaBzoMpdcArwrWWsJ5kGu73Ai0t7umzoWDV8oiekLmSkN4zNkGdK6QBehQSy4coYDYB8OV0ryB7F39bAdo7FF1Av1JBxJT4_47umQEPPbon3YFXUi8FbDj10buIkKFyKN_9fO2qAn2oT5H_rIRjDtIceC6yplRx5eE-Nqal0b4jG3E-il3jv0IoYqyPQ3_VAL-Lz9zh1MwGOsDv4legg_fdoQMfYMHwbyC5I8-phvfBOpm5XY_3wapKnK94dVW8b08aq5w-tZAf9Dkv5Ld3hsvicYX0IsiFo_Squjz0N_M40MuYmQ-JAY7jWAJlhMOAwnKXAP_uopkF40QmF68hBsTox6Z-MQJ4H3QxiOO0PP6HNhDIvYLS5VcCAPlcEy4E18KlEMAZvRfBAcsa2AwemOg-cgFnsCB6OeDTTpgFL8aRZ1sBFLRko-O5gEHOK5yfrhIdfBnZd6HPbQEWXvy7y2gZpDC1ElUAw4xvkXIikJSS_41oSwY7tFhl-PC-9HxFp9zluwoU8X7Sd3qFkCKLAcWSOOLdyOc3uxXLhhIxLJ1c_A7xRLCPXhSGlIEUubKiPLAFj7sP6ryo2qVjihHHVwcWUVuWRhWN_oqQgIvXoN0RWITB_MZo7mbI4gMbIkYBxnpTDi2aCDfDFhFaBO-FjtFrAE5DcJGNi8DFQwEpolCgu-MRiE21MW0WYGQCYZxWQxhBlXjk4RQiQiBTKYhxD6SIWtw3i81SOaRxinT3EMrBsDZhwJEbCg2vEXAEfioNOJpsaBXEMaW-ysGOGD3O4v0gX-cZsEckejngEXuAGN_zgS34FxlfQ0Rt2n0wAZCvima5qaEvxyEjbAO8nTO7Z-t5xAhEChxSHzDk4ZDm4WZwSHBc-9MQfTB8wsGXCngkdxkO4-C4EiAJyzEnJsnxSGHADAup4JJPuHUHS88kNEnHApwE_5n5fS7FnUar1WpweFKik6ASYWh-AuOCqNtFfbo6pjZvDN3YFFZJhToF3S4QS04g6dj5kVvHqZwPWeJhi-UlDhLmOrTPqoGWoJmYa0gfJOdzgpYPRIZy3774XAtnlwMtYfRTNwIteVtFoGV_JEBLNyZFBFv2MLgje47cBUL1GLBIWTKcqJRqmU4oAUtoyZlhlrYrMEuELBdELO9Lbrz4LMCpzJBLwyauDrrck3O8LPDSGUNzLnUTNEJKOhF-CdNHxS7gy3Ae-BJDK8lwC6KX0frCgITRca8GvnQxxEjhluc63JJz63IyESVs2RcCgbilLWBLF_wp8Sr0KmOXVbISnyW6gf7pHxd8eT4vfCkWJIIv3SXDl-4MwEzo6ERMgEkHV4dguoiZuxC1o7qsDGHawEFjrQNoRjA_jRDMTwNYs-ivuC8fwXTfAII5f9Li3vvzI5hV4Muk9xEDmNyEREmMEYDJpaQagPkSPTAnGUaxMvjlIShiEpaFL9-lr0gfE5mA2jKJ0SfCxJbOYrTVAMytBmJeBoJZYGNNACab-YIJ_BJMvsxklF6uXr0r4OXRtBeBoXPgljbD0Vw5ZhlSkfNEY8TydUXEsipcGfkS50mnoRpOySk9L0RZROMlgpPnBGmBR-FKg5PSt78u4CS4xTLeKINOclXkCHhS-NSlEUqhgi4PoxRcNl_yo0-kn2JwU5T0R6NfIrmfSqQS8bkSSCVYe7AfgoheBaSScqQSvANgO45UFqZBptQBrFdoV8QrqcArK8KVF58vile6BixKg1diAiomR8JweX8Jk52GLA221gRZmmJ-fY6kwWLOA1ka0QZNpqQCWeYpwpxsybKYZahilrOwOgftMsOWBTNVkydtFbYEMQCjjkOpjltefDYHcGkccBa4fP9ygMt-YZcZ5FLxsqsglxefVYQuDxC4zsCXM7CpNIQpreIMwrx4zYeRgC-54fEEGFcZv4y_fXRndmdSs0nEkbXn3nDoMK6yMIUzLjCQD0jIC_DCq2sK9CkOWvc865zsEEsiMg38fkdTjoeg-6gfEoWHLNxzGH68d75vra7wQvwv2q6s6RqBgA6saCgGv8P7xjbuhuKyC7a6wi9b4s2oLaS-2AOymm5sZ4es8IuIVtR54g_vyWdj74SV6gx_4hk30NRFedDQzR9-9q0frWTLcxk6CkHFoFvLwn2IzSVJVtYJdOYfq918BGooYKbxBibKrMdTrTDqL374MchK9XFre0rwZYotDygefhyCNeTXhuRwZp8XwPIGxsTbNfJ4Dd-vrDVOqDNl6cHpJ8TLr_Nmlcng0fhzPhLlZWJu8biVwtqhMzHOIDn8D6bMPz-CNwjb3XWc1ZX34ovFvqGSN2qgMfD8PdofrYK12tnV8Ino75ihCDNHJ0uCTNlVRwlKXrLwHh8I3kCXffoedPANnViJsSqcZqifHcJHaZbSEx6Yat-1QxtdV0a4ewJ8hWkVcZGYxtSy9k7gwwHiY-AgrK48ePpYDuwAajALGADYLUNK5FzMNwnAJFicRZCJNSvLCxwIzkyx2TDFZmvkm98kK8xVpK0UL0PLcS8mPo0LrN15K2ciXIZNs4iUsH4aWq14KZYgo8eTo8nX4ikjdRXq0aifq9iGhK6UA9puRpeebDdxKvgvglG7_wdEGw-tJssAAA)

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
