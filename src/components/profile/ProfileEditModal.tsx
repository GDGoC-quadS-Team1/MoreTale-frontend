import { useMemo, useState } from "react";
import styled from "styled-components";
import ProfileForm from "./ProfileForm";
import {
    buildUpdateProfileRequest,
    profileToSignUpFormState,
    updateUserProfile,
    validateSignUpForm,
    type MyPageProfile,
    type SignUpFormState,
} from "../../apis/user";

type ProfileEditModalProps = {
    profile: MyPageProfile;
    isOpen: boolean;
    onClose: () => void;
    onUpdated: (profile: MyPageProfile) => void;
};

const ProfileEditModal = ({ profile, isOpen, onClose, onUpdated }: ProfileEditModalProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const initialValues = useMemo(() => profileToSignUpFormState(profile), [profile]);

    if (!isOpen) return null;

    const handleComplete = async (form: SignUpFormState) => {
        const validationError = validateSignUpForm(form);
        if (validationError) {
            setSubmitError(validationError);
            return;
        }

        const confirmed = window.confirm("수정하시겠습니까?");
        if (!confirmed) return;

        setSubmitError(null);
        setIsSubmitting(true);
        try {
            const body = buildUpdateProfileRequest(form, profile);
            const { data } = await updateUserProfile(profile.profileId, body);
            onUpdated(data);
            onClose();
        } catch {
            setSubmitError("프로필 수정에 실패했습니다. 잠시 후 다시 시도해주세요.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Overlay onClick={onClose}>
            <ModalContainer onClick={(e) => e.stopPropagation()}>
                <ProfileForm
                    key={profile.profileId}
                    initialValues={initialValues}
                    onComplete={handleComplete}
                    isSubmitting={isSubmitting}
                    submitError={submitError}
                />
            </ModalContainer>
        </Overlay>
    );
};

export default ProfileEditModal;

const Overlay = styled.div`
    position: fixed;
    inset: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.45);
    padding: 40px;
    box-sizing: border-box;
`;

const ModalContainer = styled.div`
    background: #FFFFFF;
    width: 100%;
    max-width: 720px;
    max-height: 90dvh;
    padding: 40px 48px;
    border-radius: 12px;
    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.15);
    overflow-y: auto;
    box-sizing: border-box;
`;
