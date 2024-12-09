package com.chay.CarPooling.utils;

import ai.onnxruntime.OrtEnvironment;
import ai.onnxruntime.OrtException;
import ai.onnxruntime.OrtSession;

/**
 * @author: Abderrahman Youabd aka: A1ST
 * @version: 1.0
 */
public class OrtSessionManager {
    private static OrtSession session;

    public static synchronized OrtSession getSession(String modelPath, OrtEnvironment env) throws OrtException {
        if (session == null) {
            session = env.createSession(modelPath, new OrtSession.SessionOptions());
        }
        return session;
    }
}

