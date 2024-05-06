"use client"

import classes from './PopularAnimes.module.css';
import {Carousel} from "@mantine/carousel";
import {useQuery} from "@tanstack/react-query";
import {Skeleton, Title} from "@mantine/core";
import CarouselCard from "@/components/CarouselCard/CarouselCard";
import {Dispatch, SetStateAction, useRef, useState} from "react";
import {client} from "@/lib/shikimori/client";
import {StatusType} from "@/types/Shikimori/Responses/Types/StatusType";
import AutoScroll from 'embla-carousel-auto-scroll'

export function PopularAnimes() {
    const autoplay
        = useRef(
            AutoScroll({
                speed: 2,
                direction: "forward",
                startDelay: 2000
            })
    );
    const shikimori = client()
    const currentYear = new Date().getFullYear().toString()
    const [year, setYear] = useState(currentYear)
    const [animeStatus, setAnimeStatus]: [animeStatus: StatusType | undefined, Dispatch<SetStateAction<StatusType | undefined>>] = useState<StatusType | undefined>("ongoing")

    const { data, status, error } = useQuery({
        queryKey: ['hero', 'popular', year],
        queryFn: getPopularTitles,
    });

    async function getPopularTitles() {
        return await shikimori.animes.list({
            limit: 15,
            status: animeStatus,
            year: year,
            order: "popularity"
        })
    }

    const carouselSlides = Array.from({ length: 15 })

    if (status === 'success' && data.animes.length < 15) {
        const previousYear = (new Date().getFullYear() - 1).toString()
        setYear(previousYear)
        setAnimeStatus("released")
    }

    return (
        <div className={classes.hero}>
            <Title>Сейчас популярно</Title>
            <Carousel
                classNames={{
                    control: classes.control
                }}
                slideSize={225}
                height={325}
                slideGap="md"
                controlsOffset="md"
                controlSize={40}
                loop
                dragFree
                plugins={[autoplay.current]}
                onMouseEnter={autoplay.current.stop}
                onMouseLeave={autoplay.current.play}
            >
                {
                    carouselSlides.map((_slide, index) => {
                        return (
                            <Carousel.Slide key={index}>
                                {
                                    status === 'success'
                                        ? (
                                            <>
                                                <CarouselCard animeTitle={data.animes[index]} />
                                            </>
                                        )
                                        : status === 'error' ? (
                                            <>Error: {error.message}</>
                                        ) : (
                                            <Skeleton width={209} height={317} />
                                        )
                                }
                            </Carousel.Slide>
                        )
                    })
                }
            </Carousel>
        </div>
    );
}