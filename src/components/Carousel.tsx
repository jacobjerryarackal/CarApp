import React from 'react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import styles from "./CaroselBanner.module.css";

const CaroselBanner = () => {
    return (
        <div className={styles.swiper}>
            <Swiper
                spaceBetween={30}
                centeredSlides={true}
                autoplay={{
                    delay: 6500,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                }}
                navigation={true}
                modules={[Autoplay, Pagination, Navigation]}
                className="mySwiper"
            >
                <SwiperSlide>
                    <img src="https://static1.hotcarsimages.com/wordpress/wp-content/uploads/2023/04/new-project-10.jpg?q=50&fit=crop&w=1100&h=618&dpr=1.5" alt="" />
                </SwiperSlide>
                <SwiperSlide>
                    <img src="https://originserver-static1-uat.pvrcinemas.com/pvrcms/banners/Unlimited_Offer_8445.jpg" alt="" />
                </SwiperSlide>
                <SwiperSlide>
                    <img src="https://originserver-static1-uat.pvrcinemas.com/pvrcms/banners/THE_HAUNTED_HOUR_Offer_3951.jpg" alt="" />
                </SwiperSlide>
                <SwiperSlide>
                    <img src="https://originserver-static1-uat.pvrcinemas.com/pvrcms/banners/MyGlamm_Offer_8173.jpg" alt="" />
                </SwiperSlide>
                <SwiperSlide>
                    <img src="https://originserver-static1-uat.pvrcinemas.com/pvrcms/banners/Airtel_New_Offer_9006.jpg" alt="" />
                </SwiperSlide>
                <SwiperSlide>
                    <img src="https://originserver-static1-uat.pvrcinemas.com/pvrcms/banners/MobiKwik_2882.jpg" alt="" />
                </SwiperSlide>
                <SwiperSlide>
                    <img src="https://originserver-static1-uat.pvrcinemas.com/pvrcms/banners/Kotak-Welcome_back__1738.jpg" alt="" />
                </SwiperSlide>
            </Swiper>
        </div>
    );
};

export default CaroselBanner;