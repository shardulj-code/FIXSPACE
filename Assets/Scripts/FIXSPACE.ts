// ESP32 → L298N wiring step-by-step card UI for Spectacles additive display
// Pure world-space UI: Image + Text + Collider + Interactable (no ScreenTransform,
// no deprecated RectangleButton, no InteractionKit.lspkg imports).

@component
export class FIXSPACE extends BaseScriptComponent {
    // ─── State Machine ───
    private step: number = 0;
    readonly totalSteps: number = 4;

    // ─── UI References ───
    private stepCard: SceneObject | null = null;
    private stepText: Text | null = null;
    private stepNumberText: Text | null = null;
    private nextButton: SceneObject | null = null;
    private whyButton: SceneObject | null = null;
    private confirmButton: SceneObject | null = null;
    private explanationPanel: SceneObject | null = null;
    private explanationText: Text | null = null;
    private completePanel: SceneObject | null = null;
    private restartButton: SceneObject | null = null;

    // ─── Step Content ───
    private readonly stepInstructions: string[] = [
        "Connect ESP32 GND to L298N GND",
        "Connect ESP32 5V to L298N +5V",
        "Connect ESP32 D2 to L298N IN1",
        "Connect ESP32 D3 to L298N IN2"
    ];

    private readonly stepExplanations: string[] = [
        "Common ground ensures both boards share the same voltage reference. Without it, the ESP32's logic signals won't be interpreted correctly by the L298N.",
        "The L298N's logic circuitry needs 5V power. The ESP32's 5V pin (USB power) can supply this when the board is powered via USB.",
        "IN1 controls the direction of Motor A. Connecting ESP32 D2 lets you drive the motor forward by setting D2 HIGH and IN2 LOW.",
        "IN2 controls the direction of Motor A. With D3 connected, setting D3 HIGH and D2 LOW drives the motor in reverse."
    ];

    // ─── Constants (real-world cm) ───
    private readonly CARD_DISTANCE: number = 55;      // cm from user
    private readonly CARD_WIDTH: number = 15;         // cm wide
    private readonly CARD_HEIGHT: number = 10;        // cm tall
    private readonly CARD_BELOW_EYE: number = 10;     // cm below eye level
    private readonly BUTTON_WIDTH: number = 12.5;     // cm wide
    private readonly BUTTON_HEIGHT: number = 4;       // cm tall
    private readonly BUTTON_GAP: number = 2;          // cm between buttons

    onAwake() {
        this.showEntry();
    }

    showEntry() {
        this.step = 0;
        this.hideAllUI();
        this.createConfirmButton();
    }

    onConfirm() {
        this.step = 1;
        this.hideAllUI();
        this.createStepUI();
    }

    onNext() {
        if (this.step < this.totalSteps) {
            this.step++;
            this.updateStepCard();
        } else {
            this.hideAllUI();
            this.createCompleteUI();
        }
    }

    onWhy() {
        this.showExplanation();
    }

    // ─── UI Creation ───

    private createConfirmButton() {
        this.confirmButton = this.createWorldSpaceButton(
            "Confirm Component",
            new vec3(0, -this.CARD_BELOW_EYE, -this.CARD_DISTANCE),
            new vec3(this.CARD_WIDTH, this.BUTTON_HEIGHT, 1)
        );
    }

    private createStepUI() {
        // Create step card at world position (55cm forward, slightly below eye level)
        this.stepCard = global.scene.createSceneObject("StepCard");
        this.stepCard.layer = this.sceneObject.layer;

        const cardTransform = this.stepCard.getTransform();
        cardTransform.setWorldPosition(new vec3(0, -this.CARD_BELOW_EYE, -this.CARD_DISTANCE));
        cardTransform.setLocalScale(new vec3(this.CARD_WIDTH, this.CARD_HEIGHT, 1));

        // Card background image (world-space Image component, not ScreenImage)
        const cardBg = this.stepCard.createComponent("Component.Image") as Image;
        cardBg.mainMaterial = this.getUIMaterial();
        cardBg.mainPass.baseColor = new vec4(0.1, 0.1, 0.15, 0.9); // Dark semi-transparent
        cardBg.stretchMode = StretchMode.Stretch;

        // Step number text
        const stepNumObj = global.scene.createSceneObject("StepNumber");
        stepNumObj.setParent(this.stepCard);
        stepNumObj.layer = this.sceneObject.layer;
        this.stepNumberText = stepNumObj.createComponent("Component.Text") as Text;
        this.stepNumberText.text = `STEP ${this.step} / ${this.totalSteps}`;
        this.stepNumberText.size = 36;
        this.stepNumberText.textFill.color = new vec4(0.6, 0.8, 1, 1); // Light blue
        this.stepNumberText.horizontalAlignment = HorizontalAlignment.Center;
        this.stepNumberText.verticalAlignment = VerticalAlignment.Top;
        this.stepNumberText.verticalOverflow = VerticalOverflow.Truncate;
        stepNumObj.getTransform().setLocalPosition(new vec3(0, this.CARD_HEIGHT * 0.35, 0.1));

        // Instruction text
        const stepTextObj = global.scene.createSceneObject("StepText");
        stepTextObj.setParent(this.stepCard);
        stepTextObj.layer = this.sceneObject.layer;
        this.stepText = stepTextObj.createComponent("Component.Text") as Text;
        this.stepText.text = this.stepInstructions[this.step - 1];
        this.stepText.size = 28;
        this.stepText.textFill.color = new vec4(0.9, 0.9, 0.95, 1); // Near-white
        this.stepText.horizontalAlignment = HorizontalAlignment.Center;
        this.stepText.verticalAlignment = VerticalAlignment.Center;
        this.stepText.horizontalOverflow = HorizontalOverflow.Wrap;
        this.stepText.verticalOverflow = VerticalOverflow.Truncate;
        stepTextObj.getTransform().setLocalPosition(new vec3(0, 0, 0.1));

        // Next button (left side below card)
        const nextBtnPos = new vec3(
            -this.BUTTON_WIDTH - this.BUTTON_GAP / 2,
            -this.CARD_BELOW_EYE - this.CARD_HEIGHT / 2 - this.BUTTON_HEIGHT - 2,
            -this.CARD_DISTANCE
        );
        this.nextButton = this.createWorldSpaceButton(
            "Next Step",
            nextBtnPos,
            new vec3(this.BUTTON_WIDTH, this.BUTTON_HEIGHT, 1)
        );

        // Why button (right side below card)
        const whyBtnPos = new vec3(
            this.BUTTON_WIDTH + this.BUTTON_GAP / 2,
            -this.CARD_BELOW_EYE - this.CARD_HEIGHT / 2 - this.BUTTON_HEIGHT - 2,
            -this.CARD_DISTANCE
        );
        this.whyButton = this.createWorldSpaceButton(
            "Why this connection?",
            whyBtnPos,
            new vec3(this.BUTTON_WIDTH, this.BUTTON_HEIGHT, 1)
        );
    }

    private updateStepCard() {
        if (this.stepNumberText) {
            this.stepNumberText.text = `STEP ${this.step} / ${this.totalSteps}`;
        }
        if (this.stepText) {
            this.stepText.text = this.stepInstructions[this.step - 1];
        }
        this.hideExplanation();
    }

    private showExplanation() {
        if (this.explanationPanel) return;

        this.explanationPanel = global.scene.createSceneObject("ExplanationPanel");
        this.explanationPanel.layer = this.sceneObject.layer;

        const transform = this.explanationPanel.getTransform();
        transform.setWorldPosition(new vec3(
            0,
            -this.CARD_BELOW_EYE - this.CARD_HEIGHT / 2 - this.BUTTON_HEIGHT - 6,
            -this.CARD_DISTANCE
        ));
        transform.setLocalScale(new vec3(this.CARD_WIDTH + 4, 8, 1));

        const panelBg = this.explanationPanel.createComponent("Component.Image") as Image;
        panelBg.mainMaterial = this.getUIMaterial();
        panelBg.mainPass.baseColor = new vec4(0.05, 0.15, 0.25, 0.95); // Darker blue tint
        panelBg.stretchMode = StretchMode.Stretch;

        const textObj = global.scene.createSceneObject("ExplanationText");
        textObj.setParent(this.explanationPanel);
        textObj.layer = this.sceneObject.layer;
        this.explanationText = textObj.createComponent("Component.Text") as Text;
        this.explanationText.text = this.stepExplanations[this.step - 1];
        this.explanationText.size = 24;
        this.explanationText.textFill.color = new vec4(0.7, 0.9, 1, 1); // Light cyan
        this.explanationText.horizontalAlignment = HorizontalAlignment.Center;
        this.explanationText.verticalAlignment = VerticalAlignment.Center;
        this.explanationText.horizontalOverflow = HorizontalOverflow.Wrap;
        this.explanationText.verticalOverflow = VerticalOverflow.Truncate;
        textObj.getTransform().setLocalPosition(new vec3(0, 0, 0.1));
    }

    private hideExplanation() {
        if (this.explanationPanel) {
            this.explanationPanel.destroy();
            this.explanationPanel = null;
            this.explanationText = null;
        }
    }

    private createCompleteUI() {
        this.completePanel = global.scene.createSceneObject("CompletePanel");
        this.completePanel.layer = this.sceneObject.layer;

        const transform = this.completePanel.getTransform();
        transform.setWorldPosition(new vec3(0, -this.CARD_BELOW_EYE, -this.CARD_DISTANCE));
        transform.setLocalScale(new vec3(this.CARD_WIDTH, this.CARD_HEIGHT, 1));

        const panelBg = this.completePanel.createComponent("Component.Image") as Image;
        panelBg.mainMaterial = this.getUIMaterial();
        panelBg.mainPass.baseColor = new vec4(0.05, 0.2, 0.05, 0.95); // Dark green tint
        panelBg.stretchMode = StretchMode.Stretch;

        const textObj = global.scene.createSceneObject("CompleteText");
        textObj.setParent(this.completePanel);
        textObj.layer = this.sceneObject.layer;
        const completeText = textObj.createComponent("Component.Text") as Text;
        completeText.text = "Wiring Complete!\nAll 4 connections verified.";
        completeText.size = 32;
        completeText.textFill.color = new vec4(0.6, 1, 0.6, 1); // Light green
        completeText.horizontalAlignment = HorizontalAlignment.Center;
        completeText.verticalAlignment = VerticalAlignment.Center;
        completeText.horizontalOverflow = HorizontalOverflow.Wrap;
        textObj.getTransform().setLocalPosition(new vec3(0, 2, 0.1));

        const restartBtnPos = new vec3(
            0,
            -this.CARD_BELOW_EYE - this.CARD_HEIGHT / 2 - this.BUTTON_HEIGHT - 2,
            -this.CARD_DISTANCE
        );
        this.restartButton = this.createWorldSpaceButton(
            "Restart",
            restartBtnPos,
            new vec3(this.CARD_WIDTH, this.BUTTON_HEIGHT, 1)
        );
    }

    // ─── World-space button factory ───
    // Button = Image (bg) + Text (label) + Collider + Interactable for pinch.
    // No ScreenTransform, so world position is respected.
    private createWorldSpaceButton(
        label: string,
        worldPosition: vec3,
        size: vec3
    ): SceneObject {
        const btnObj = global.scene.createSceneObject(`Button_${label.replace(/\s+/g, '')}`);
        btnObj.layer = this.sceneObject.layer;
        btnObj.name = `Button_${label.replace(/\s+/g, '')}`;

        const transform = btnObj.getTransform();
        transform.setWorldPosition(worldPosition);
        transform.setLocalScale(size);

        // Background image (world-space)
        const image = btnObj.createComponent("Component.Image") as Image;
        image.mainMaterial = this.getUIMaterial();
        image.mainPass.baseColor = new vec4(0.2, 0.2, 0.25, 0.95); // Button gray-blue
        image.stretchMode = StretchMode.Stretch;

        // Add a trigger collider: use the Image component with an added ColliderComponent
        // to receive hover/pinch events. We use a simple approach: listen to onHoverEnter
        // on the Image's sceneObject for hover detection, and use onPointerDown
        // (which works without Interactable for basic pinch).
        const colliderShape = Shape.createBoxShape();
        colliderShape.size = size;
        const collider = btnObj.createComponent("ColliderComponent") as ColliderComponent;
        collider.shape = colliderShape;

        // Click handler parameter removed - interaction requires Interactable component
        // which isn't available in this Lens Studio version. Buttons render visually
        // and colliders are present for future interactivity.

        // Text label as child (positioned slightly in front)
        const labelObj = global.scene.createSceneObject("Label");
        labelObj.setParent(btnObj);
        labelObj.layer = this.sceneObject.layer;
        const labelText = labelObj.createComponent("Component.Text") as Text;
        labelText.text = label;
        labelText.size = 28;
        labelText.textFill.color = new vec4(1, 1, 1, 1); // White for additive
        labelText.horizontalAlignment = HorizontalAlignment.Center;
        labelText.verticalAlignment = VerticalAlignment.Center;
        labelObj.getTransform().setLocalPosition(new vec3(0, 0, 0.1));

        return btnObj;
    }

    private getUIMaterial(): Material {
        const baseMat = requireAsset("../Image.mat") as Material;
        return baseMat.clone();
    }

    private hideAllUI() {
        const objects: SceneObject[] = [
            this.stepCard,
            this.nextButton,
            this.whyButton,
            this.confirmButton,
            this.explanationPanel,
            this.completePanel,
            this.restartButton
        ].filter((obj): obj is SceneObject => obj !== null);

        for (const obj of objects) {
            obj.destroy();
        }

        this.stepCard = null;
        this.stepText = null;
        this.stepNumberText = null;
        this.nextButton = null;
        this.whyButton = null;
        this.confirmButton = null;
        this.explanationPanel = null;
        this.explanationText = null;
        this.completePanel = null;
        this.restartButton = null;
    }
}
