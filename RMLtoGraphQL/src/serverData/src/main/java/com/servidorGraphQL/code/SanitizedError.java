package com.servidorGraphQL.code;

import com.fasterxml.jackson.annotation.JsonIgnore;
import graphql.ExceptionWhileDataFetching;

public class SanitizedError extends ExceptionWhileDataFetching {
    
    public SanitizedError(ExceptionWhileDataFetching inner) {
        super(inner.getException());
    }

    @Override
    @JsonIgnore
    public Throwable getException() {
        return super.getException();
    }
}
