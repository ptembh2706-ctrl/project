package com.etour.app.interceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class BookingInterceptor implements HandlerInterceptor {

    private static final Logger logger = LoggerFactory.getLogger(BookingInterceptor.class);

    private ThreadLocal<Long> startTime = new ThreadLocal<>();

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {

        startTime.set(System.currentTimeMillis());

        logger.info("====================================================");
        logger.info("[BOOKING-START] 🚀 Booking Started");

        // Request details
        logger.info("[REQUEST] Method: {}", request.getMethod());
        logger.info("[REQUEST] URI: {}", request.getRequestURI());
        logger.info("[REQUEST] IP: {}", request.getRemoteAddr());

        logger.info("====================================================");

        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request,
                                HttpServletResponse response,
                                Object handler,
                                Exception ex) {

        long timeTaken = System.currentTimeMillis() - startTime.get();

        logger.info("[BOOKING-TIME]  Time Taken: {} ms", timeTaken);

        startTime.remove();
    }
}
