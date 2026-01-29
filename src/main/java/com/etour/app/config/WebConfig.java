package com.etour.app.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.etour.app.interceptor.BookingInterceptor;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Autowired
    private BookingInterceptor bookingInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {

        registry.addInterceptor(bookingInterceptor)
                .addPathPatterns("/api/bookings/create"); // ONLY create booking
    }
}
