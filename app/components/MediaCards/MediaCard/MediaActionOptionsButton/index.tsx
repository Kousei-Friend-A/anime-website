"use client"
import React, { useState } from 'react'
import styles from "../component.module.css"
import { AnimatePresence, motion } from 'framer-motion'
import PlusSvg from "@/public/assets/plus-lg.svg"
import { ApiDefaultResult } from '@/app/ts/interfaces/apiAnilistDataInterface'
import OptionsPanel from './OptionsPanel'
import ShowUpLoginPanelAnimated from '@/app/components/UserLoginModal/animatedVariant'
import { getAuth } from 'firebase/auth'

export default function MediaActionOptionsButton({ mediaInfo }: { mediaInfo: ApiDefaultResult }) {

    const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false)

    const [isUserModalOpen, setIsUserModalOpen] = useState(false)

    const auth = getAuth()
    
    return (
        <React.Fragment>

            <ShowUpLoginPanelAnimated
                apperanceCondition={isUserModalOpen}
                customOnClickAction={() => setIsUserModalOpen(false)}
                auth={auth}
            />

            <div className={styles.options_btn_container}>

                <motion.button
                    aria-label={isPanelOpen ? "Close Options" : "Open Options"}
                    onClick={() => setIsPanelOpen(!isPanelOpen)}
                    whileTap={{ scale: 0.9 }}
                    data-active={isPanelOpen}
                >
                    <PlusSvg fill="var(--brand-color)" />
                </motion.button>

            </div>

            <AnimatePresence>
                {isPanelOpen && (
                    <OptionsPanel
                        toggleLoginModalVisibility={() => setIsUserModalOpen(!isUserModalOpen)}
                        isPanelOpen={isPanelOpen}
                        setIsPanelOpen={setIsPanelOpen}
                        isFavourite={mediaInfo.isFavourite ? mediaInfo.isFavourite : false}
                        mediaListEntryInfo={mediaInfo.mediaListEntry || null}
                        mediaTitle={mediaInfo.title}
                        mediaInfo={mediaInfo}
                        amountWatchedOrRead={0}
                    />
                )}
            </AnimatePresence>

        </React.Fragment>
    )
}
