/**
 * Firebase Firestore 초기화 및 설정 파일 (src/firebase.ts)
 * 
 * 시니어 개발자의 친절한 가이드:
 * 1. Firebase는 구글에서 제공하는 BaaS(Backend-as-a-Service) 클라우드 플랫폼입니다.
 * 2. Firestore는 실시간 NoSQL 클라우드 데이터베이스로, 데이터를 JSON과 유사한 '문서(Document)'와 
 *    '컬렉션(Collection)' 구조로 저장합니다.
 * 3. 이 파일에서는 우리 프로젝트와 Firebase 프로젝트를 연결하고,
 *    데이터베이스 조작에 필요한 `db` 인스턴스를 외부로 내보냅니다(export).
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import firebaseConfigData from '../firebase-applet-config.json';

// Firebase 프로젝트 접속 설정 객체
const firebaseConfig = {
  apiKey: firebaseConfigData.apiKey,
  authDomain: firebaseConfigData.authDomain,
  projectId: firebaseConfigData.projectId,
  storageBucket: firebaseConfigData.storageBucket,
  messagingSenderId: firebaseConfigData.messagingSenderId,
  appId: firebaseConfigData.appId,
};

// 중복 초기화 방지: 이미 초기화된 앱이 있으면 재사용하고, 없으면 새로 초기화합니다.
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// 프로젝트에 지정된 Firestore Database ID를 연결합니다.
// ('(default)'가 아닌 별도 지정된 Database ID가 있을 경우 getFirestore(app, databaseId)로 지정합니다)
const databaseId = firebaseConfigData.firestoreDatabaseId || '(default)';
export const db = getFirestore(app, databaseId);

export default db;
