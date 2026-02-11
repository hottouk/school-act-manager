import { addDoc, collection, doc } from 'firebase/firestore';
import React, { useCallback } from 'react'
import { appFireStore, timeStamp } from '../../firebase/config';
import { useSelector } from 'react-redux';
//생성(260211)
const useFireErrData = () => {
	const db = appFireStore;
	const user = useSelector(({ user }) => user);
	const colRef = collection(db, "errorLogs");
	//01. 기본 에러 핸들러
	const errorHandler = useCallback(async (err, context = "unknown") => {
		console.log(err, context, user);
		try {
			await addDoc(colRef,
				{
					uid: String(user.uid),
					message: err.message,
					code: err.code,
					timestamp: new Date(),
					context,
				});
		} catch (error) {
			alert("에러 로깅 실패");
			console.log(error);
		}
	}, []);

	return ({ errorHandler });
}

export default useFireErrData