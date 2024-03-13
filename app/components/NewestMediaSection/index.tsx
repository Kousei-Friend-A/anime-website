"use client"
import React, { useEffect, useState } from 'react'
import styles from "./component.module.css"
import MediaListCoverInfo from '../MediaItemCoverInfo2'
import CardMediaCoverAndDescription from '../CardMediaCoverAndDescription'
import NavButtons from '../NavButtons'
import { ApiAiringMidiaResults, ApiDefaultResult } from '@/app/ts/interfaces/apiAnilistDataInterface'
import API from "@/api/anilist"

type PropsTypes = {

    data: ApiDefaultResult[],
    currentQueryValue?: string

}

function NewestMediaSection(props: PropsTypes) {

    const [mediaList, setMediaList] = useState<ApiAiringMidiaResults[] | ApiDefaultResult[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)

    let { data } = props
    let currentQueryValue = 1 //stands for 1 day (today)

    // request new type of media then set them
    const loadMedia: (parameter: number) => void = async (parameter: number) => {
        console.log(`Received parameter: ${parameter}`);

        getMediaByDaysRange(parameter)

    }

    // gets the range of days than parse it to unix, runs function to get any media releasing in the selected range
    async function getMediaByDaysRange(days: number) {

        currentQueryValue = days

        setIsLoading(true)

        const response = await API.getReleasingByDaysRange("ANIME", days, undefined, 11).then(
            res => ((res as ApiAiringMidiaResults[]).map(
                (item: ApiAiringMidiaResults) => item.media).filter((item) => item.isAdult == false)
            )
        ).then(res => res.sort((a, b) => a.popularity - b.popularity).reverse())

        setMediaList(response)

        setIsLoading(false)

    }

    useEffect(() => {
        if (data[0] == null || data[0] == undefined) {
            getMediaByDaysRange(30)
        }
        else {
            setMediaList(data)
            setIsLoading(false)
        }
    }, [currentQueryValue])

    return (
        <div id={styles.newest_conteiner}>

            <div className={styles.title_navbar_container}>

                <h3>Newest Animes Episodes</h3>

                <NavButtons
                    functionReceived={loadMedia as (parameter: string | number) => void}
                    actualValue={data[0] == null || data[0] == undefined ? 30 : currentQueryValue}
                    options={[
                        { name: "Today", value: 1 }, { name: "This week", value: 7 }, { name: "Last 30 days", value: 30 }
                    ]} />

            </div>

            <ul>
                {!isLoading && (
                    <>
                        <li>
                            {(mediaList[0] != undefined) ? (
                                <CardMediaCoverAndDescription data={(mediaList as ApiDefaultResult[])[0]} />
                            ) : (
                                <p>No results for today</p>
                            )}
                        </li>

                        {(mediaList as ApiDefaultResult[]).slice(1, 11).map((item, key: number) => (
                            <MediaListCoverInfo key={key} positionIndex={key + 1} data={item} showCoverArt={true} alternativeBorder={true} />
                        ))}
                    </>
                )}
            </ul>

        </div>
    )
}

export default NewestMediaSection