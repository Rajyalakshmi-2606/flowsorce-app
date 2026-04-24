"use client";
import React, { useEffect } from 'react';
import { useApi, identityApiRef } from '@backstage/core-plugin-api';
import { useAppDispatch } from '../store/hooks';
import { setUserDetails } from '../store/app/slice';
import { logData } from '../utils/common';

export const UserInitializer: React.FC = () => {
  const identityApi = useApi(identityApiRef);
  const dispatch = useAppDispatch();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const profile = await identityApi.getProfileInfo();
        const backstageIdentity = await identityApi.getBackstageIdentity();
        if (cancelled) return;
        const entityRef = backstageIdentity.userEntityRef || '';
        const refName = entityRef.split('/').pop() || 'User';
        const name = profile.displayName || profile.email || refName;
        const email = profile.email || '';
        dispatch(setUserDetails({ name, email }));
        logData('info', { message: 'PDLC user initialized', name, email, entityRef });
      } catch (e:any) {
        if (cancelled) return;
        logData('warn', { message: 'Failed to init PDLC user, defaulting to Anonymous', error: e?.message });
        dispatch(setUserDetails({ name: 'Anonymous', email: '' }));
      }
    })();
    return () => { cancelled = true; };
  }, [identityApi, dispatch]);

  return null;
};
